"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const fs_1 = __importDefault(require("fs"));
const Pelicula_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Pelicula"));
const Genero_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Genero"));
class ControllerPeliculasController {
    async index({ response }) {
        const peliculas = await Pelicula_1.default.query().preload('generos');
        return response.json(peliculas);
    }
    async genero({ response, request }) {
        var generoNombre = decodeURIComponent(request.param('genero'));
        const genero = await Genero_1.default.findBy('nombre', generoNombre);
        return response.json(genero);
    }
    async generos({ response }) {
        const generos = await Genero_1.default.all();
        return response.json(generos);
    }
    async ultimasPeliculas({ response }) {
        const peliculas = await Pelicula_1.default.query().orderBy('created_at', 'desc').limit(5).preload('generos');
        return response.json(peliculas);
    }
    async pelicula({ response, request }) {
        const id = request.param('id');
        const pelicula = await Pelicula_1.default.query().where('id', id).preload('generos').first();
        return response.json(pelicula);
    }
    async peliculasGenero({ response, request }) {
        const genero = decodeURIComponent(request.param('genero'));
        const peliculas = await Pelicula_1.default.query().whereHas('generos', (query) => {
            query.where('nombre', genero);
        }).preload('generos');
        return response.json(peliculas);
    }
    async peliculaStream({ request, response }) {
        const id = request.param('id');
        const pelicula = await Pelicula_1.default.findOrFail(id);
        const location = `public/movies/${pelicula.titulo}.mp4`;
        if (fs_1.default.existsSync(location)) {
            const videoStream = await fs_1.default.createReadStream(location);
            response.header('Content-Type', 'video/mp4');
            videoStream.pipe(response.response);
            await new Promise((resolve) => {
                videoStream.on('end', resolve);
            });
        }
        return response.status(404).json({ message: 'Video no becouse', location: location });
    }
    async guardarImagen({ request, response }) {
        const id = request.param('id');
        const pelicula = await Pelicula_1.default.findOrFail(id);
        const imagen = request.file('imagen', {
            size: '10mb',
            extnames: ['jpg', 'png', 'jpeg'],
        });
        if (!imagen) {
            return response.status(400).json({ message: 'No se ha enviado ninguna imagen' });
        }
        await imagen.move('public/img', {
            name: pelicula.titulo + '.jpg',
            overwrite: true
        });
        if (imagen.fileName) {
            pelicula.imagen_url = `img/${imagen.fileName}`;
            pelicula.video_url = `movies/${pelicula.titulo}.mp4`;
            await pelicula.save();
            return response.status(201).json({ message: 'Imagen guardada' });
        }
        return response.status(400).json({ message: imagen.errors });
    }
    async create({ request, response }) {
        const peliculaReglasValidacion = Validator_1.schema.create({
            titulo: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.minLength(3),
                Validator_1.rules.maxLength(255),
            ]),
            descripcion: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.minLength(3),
                Validator_1.rules.maxLength(255),
            ]),
            fecha_estreno: Validator_1.schema.date(),
            generos: Validator_1.schema.array().members(Validator_1.schema.number())
        });
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
            });
        }
        catch (error) {
            return response.status(400).json(error.messages);
        }
        const pelicula = new Pelicula_1.default();
        const Idsgeneros = request.input('generos');
        pelicula.titulo = request.input('titulo');
        pelicula.descripcion = request.input('descripcion');
        pelicula.fechaEstreno = request.input('fecha_estreno');
        if (await pelicula.save()) {
            for (let generoid of Idsgeneros) {
                await pelicula.related('generos').attach([generoid]);
            }
            return response.status(201).json(pelicula);
        }
        return response.status(400).json({ message: 'Error al guardar la pelicula' });
    }
}
exports.default = ControllerPeliculasController;
//# sourceMappingURL=PeliculasController.js.map