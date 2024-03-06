import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import Pelicula from 'App/Models/Pelicula'

export default class ControllerPeliculasController {
    public async guardarImagen({request,response}: HttpContextContract){

        const id = request.param('id')
        const pelicula = await Pelicula.findOrFail(id)

        const imagen = request.file('imagen', {
            size: '10mb',
            extnames: ['jpg', 'png', 'jpeg'],
        })
        if (!imagen) {
            return response.status(400).json({message: 'No se ha enviado ninguna imagen'})
        }
        await imagen.move('public/img', {
            name: pelicula.titulo+'.jpg',
            overwrite: true
        })
        if (imagen.fileName) {
            pelicula.imagen_url = `img/${imagen.fileName}`
            await pelicula.save()
            return response.status(201).json({message: 'Imagen guardada'})
        }
        return response.status(400).json({message: imagen.errors})
    }
     public async index({ response}: HttpContextContract) {
        const peliculas = await Pelicula.query().preload('generos')
        return response.json(peliculas)
     }
     public async create({request,response }: HttpContextContract) {
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
        const Idsgeneros= request.input('generos')
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
