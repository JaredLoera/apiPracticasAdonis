import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Sala from 'App/Models/Sala'
import User from 'App/Models/User'
import Notificacion from 'App/Models/Notificacion'

export default class SalasController {
    public async getSalasInvitado({ auth, response }: HttpContextContract) {
        const user = await auth.user
        const salas = await user?.related('salas').query().preload('user')
        return response.status(200).json(salas)
    }
    public async getMisSalas({ auth, response }: HttpContextContract) {
        const user = await auth.user
        const salas = await Sala.query().where('user_id', user!.id)
        return response.status(200).json(salas)
    }

    public async createSalas({ auth, response, request }: HttpContextContract) {
        const salaSchema = schema.create({
            nombre: schema.string({ trim: true }, [
                rules.required(),
                rules.maxLength(50)
            ]),
            pelicula_id: schema.number([
                rules.required()
            ])
        })
        try {
            await request.validate({
                schema: salaSchema,
                messages: {
                    required: 'El campo {{ field }} es requerido', 
                    'nombre.maxLength': 'El nombre de la sala no puede ser mayor a 50 caracteres'
                }
            })
        } catch (error) {
            return response.status(400).json({ message: error.messages })
        }
        const sala = new Sala()
        sala.nombre = request.input('nombre')
        sala.pelicula_id = request.input('pelicula_id')
        sala.user_id = auth.user!.id
        if (await sala.save()) {
            return response.status(201).json({ message: 'Sala creada' })
        }
        return response.status(500).json({ message: 'Error al crear sala' })
    }

    public async myInvitations({ auth, response }: HttpContextContract) {
        const user = await auth.user
        const numNotificaciones = await Notificacion.query().where('user_id', user!.id).andWhere('aceptada', false).andWhere('rechazada', false).getCount()
        const notificaciones = await Notificacion.query().where('user_id', user!.id).andWhere('aceptada', false).andWhere('rechazada', false).preload('quien_envia')
        return response.status(200).json({ numNotificaciones, notificaciones })
    }

    public async invitacionToUnion({ auth, request, response }: HttpContextContract) {
        const correo = request.input('correo')
        const sala_id = request.input('sala_id')
        const sala = await Sala.find(sala_id)
        const user = await User.findBy('email', correo)
        const userAuth = await auth.user
        if (userAuth!.email === correo) {
            return response.status(400).json({ message: 'No puedes invitarte a ti mismo' })
        }
        if (userAuth!.id != sala!.user_id) {
            return response.status(400).json({ message: 'No puedes invitar a un usuario a una sala que no te pertenece' })
        }
        if (user) {
            const notificacion = new Notificacion()
            notificacion.mensaje = `El usuario ${userAuth!.email} te ha invitado a unirte a la sala ${sala!.nombre}`
            notificacion.sala_id = sala!.id
            notificacion.user_id = user!.id
            notificacion.quien_envia_id = userAuth!.id
            if (await notificacion.save()) {
                return response.status(201).json({ message: 'Invitacion enviada' })
            }
            return response.status(500).json({ message: 'Error al enviar invitacion' })
        }
        return response.status(404).json({ message: 'Usuario no encontrado' })
    }

    public async aceptarInvitacion({auth, request, response }: HttpContextContract) {
        var notificacionRequest = new Notificacion()
        notificacionRequest = request.input('invitacion')
        const  notificacion = await Notificacion.findOrFail(notificacionRequest.id)
        const sala = await Sala.findOrFail(notificacion.sala_id)
        const user = await User.findOrFail(notificacion.user_id)
        if(notificacion.user_id != auth.user!.id){
            return response.status(400).json({message: 'No puedes aceptar una invitacion que no te pertenece'})
        }
        notificacion.aceptada = true
        if(await notificacion.save()){
            await sala.related('users').attach([user.id])
            return response.status(200).json({message: 'Invitacion aceptada'})
        }
        return response.status(400).json({messaje:"Error al aceptar invitacion"})
    }
}
