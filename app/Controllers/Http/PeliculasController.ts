import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import fs from 'fs';
import Pelicula from 'App/Models/Pelicula'
import Genero from 'App/Models/Genero'

export default class ControllerPeliculasController {

    public async index({ response }: HttpContextContract) {
        const peliculas = await Pelicula.query().preload('generos')
        return response.json(peliculas)
    }

    public async genero({ response, request }: HttpContextContract) {
        var generoNombre = decodeURIComponent(request.param('genero'));
        const genero = await Genero.findBy('nombre', generoNombre)
        return response.json(genero)
    }

    public async generos({ response }: HttpContextContract) {
        const generos = await Genero.all()
        return response.json(generos)
    }

    public async ultimasPeliculas({ response }: HttpContextContract) {
        const peliculas = await Pelicula.query().orderBy('created_at', 'desc').limit(5).preload('generos')
        return response.json(peliculas)
    }

    public async pelicula({ response, request }: HttpContextContract) {
        const id = request.param('id')
        const pelicula = await Pelicula.query().where('id', id).preload('generos').first()
        return response.json(pelicula)
    }

    public async peliculasGenero({ response, request }: HttpContextContract) {
        const genero = decodeURIComponent(request.param('genero'));
        const peliculas = await Pelicula.query().whereHas('generos', (query) => {
            query.where('nombre', genero)
        }).preload('generos')
        return response.json(peliculas)
    }

    public async peliculaStream({ request, response }: HttpContextContract) {
        const id = request.param('id')
        const pelicula = await Pelicula.findOrFail(id)
        const location = `public/movies/${pelicula.titulo}.mp4`
        if (fs.existsSync(location)) {
            const videoStream = await fs.createReadStream(location);
            response.header('Content-Type', 'video/mp4');
            videoStream.pipe(response.response);
            await new Promise<void>((resolve) => {
                videoStream.on('end', resolve);
            });
        }
        return response.status(404).json({ message: 'Video no becouse', location: location })
    }
    
    public async guardarImagen({ request, response }: HttpContextContract) {
        const id = request.param('id')
        const pelicula = await Pelicula.findOrFail(id)
        const imagen = request.file('imagen', {
            size: '10mb',
            extnames: ['jpg', 'png', 'jpeg'],
        })
        if (!imagen) {
            return response.status(400).json({ message: 'No se ha enviado ninguna imagen' })
        }
        await imagen.move('public/img', {
            name: pelicula.titulo + '.jpg',
            overwrite: true
        })
        if (imagen.fileName) {
            pelicula.imagen_url = `img/${imagen.fileName}`
            //cambiar letras a minusculas y quitar espacios
            const tituloMovie = pelicula.titulo.replace(/\s/g, '_').toLowerCase()
            pelicula.video_url = `movies/${tituloMovie}.mp4`
            await pelicula.save()
            return response.status(201).json({ message: 'Imagen guardada' })
        }
        return response.status(400).json({ message: imagen.errors })
    }

    public async create({ request, response }: HttpContextContract) {
        const peliculaReglasValidacion = schema.create({
            titulo: schema.string({ trim: true }, [
                rules.minLength(3),
                rules.maxLength(255),
            ]),
            descripcion: schema.string({ trim: true }, [
                rules.minLength(3),
                rules.maxLength(255),
            ]),
            fecha_estreno: schema.date(),
            generos: schema.array().members(schema.number())
        })
        try {
            await request.validate({
                schema: peliculaReglasValidacion,
                messages: {
                    required: 'El campo {{field}} es requerido',
                    minLength: 'El campo {{field}} debe ser mayor a 3 caracteres',
                    maxLength: 'El campo {{field}} debe ser menor a 255 caracteres',
                    date: 'El campo {{field}} debe ser una fecha',
                    generos: 'El campo {{field}} debe ser un arreglo de numeros'
                }
            })
        } catch (error) {
            return response.status(400).json(error.messages)
        }
        const pelicula = new Pelicula()
        const Idsgeneros = request.input('generos')
        pelicula.titulo = request.input('titulo')
        pelicula.descripcion = request.input('descripcion')
        pelicula.fechaEstreno = request.input('fecha_estreno')
        if (await pelicula.save()) {
            for (let generoid of Idsgeneros) {
                await pelicula.related('generos').attach([generoid])
            }
            return response.status(201).json(pelicula)
        }
        return response.status(400).json({ message: 'Error al guardar la pelicula' })
    }

    // public async store({ }: HttpContextContract) {
    // }
    // public async show({ }: HttpContextContract) {
    // }
    // public async edit({ }: HttpContextContract) {
    // }
    // public async update({ }: HttpContextContract) {
    // }
    // public async destroy({ }: HttpContextContract) {
    // }
}
