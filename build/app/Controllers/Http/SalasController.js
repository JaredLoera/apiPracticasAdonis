"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Sala_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Sala"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Notificacion_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Notificacion"));
class SalasController {
    async getSalasInvitado({ auth, response }) {
        const user = await auth.user;
        const salas = await user?.related('salas').query().preload('user');
        return response.status(200).json(salas);
    }
    async getMisSalas({ auth, response }) {
        const user = await auth.user;
        const salas = await Sala_1.default.query().where('user_id', user.id);
        return response.status(200).json(salas);
    }
    async createSalas({ auth, response, request }) {
        const salaSchema = Validator_1.schema.create({
            nombre: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.required(),
                Validator_1.rules.maxLength(50)
            ])
        });
        try {
            await request.validate({
                schema: salaSchema,
                messages: {
                    'nombre.required': 'El nombre de la sala es requerido',
                    'nombre.maxLength': 'El nombre de la sala no puede ser mayor a 50 caracteres'
                }
            });
        }
        catch (error) {
            return response.status(400).json({ message: error.messages });
        }
        const sala = new Sala_1.default();
        sala.nombre = request.input('nombre');
        sala.user_id = auth.user.id;
        if (await sala.save()) {
            return response.status(201).json({ message: 'Sala creada' });
        }
        return response.status(500).json({ message: 'Error al crear sala' });
    }
    async myInvitations({ auth, response }) {
        const user = await auth.user;
        const numNotificaciones = await Notificacion_1.default.query().where('user_id', user.id).andWhere('aceptada', false).andWhere('rechazada', false).getCount();
        const notificaciones = await Notificacion_1.default.query().where('user_id', user.id).andWhere('aceptada', false).andWhere('rechazada', false).preload('quien_envia');
        return response.status(200).json({ numNotificaciones, notificaciones });
    }
    async invitacionToUnion({ auth, request, response }) {
        const correo = request.input('correo');
        const sala_id = request.input('sala_id');
        const sala = await Sala_1.default.find(sala_id);
        const user = await User_1.default.findBy('email', correo);
        const userAuth = await auth.user;
        if (userAuth.email === correo) {
            return response.status(400).json({ message: 'No puedes invitarte a ti mismo' });
        }
        if (userAuth.id != sala.user_id) {
            return response.status(400).json({ message: 'No puedes invitar a un usuario a una sala que no te pertenece' });
        }
        if (user) {
            const notificacion = new Notificacion_1.default();
            notificacion.mensaje = `El usuario ${userAuth.email} te ha invitado a unirte a la sala ${sala.nombre}`;
            notificacion.sala_id = sala.id;
            notificacion.user_id = user.id;
            notificacion.quien_envia_id = userAuth.id;
            if (await notificacion.save()) {
                return response.status(201).json({ message: 'Invitacion enviada' });
            }
            return response.status(500).json({ message: 'Error al enviar invitacion' });
        }
        return response.status(404).json({ message: 'Usuario no encontrado' });
    }
    async aceptarInvitacion({ auth, request, response }) {
        var notificacionRequest = new Notificacion_1.default();
        notificacionRequest = request.input('invitacion');
        const notificacion = await Notificacion_1.default.findOrFail(notificacionRequest.id);
        const sala = await Sala_1.default.findOrFail(notificacion.sala_id);
        const user = await User_1.default.findOrFail(notificacion.user_id);
        if (notificacion.user_id != auth.user.id) {
            return response.status(400).json({ message: 'No puedes aceptar una invitacion que no te pertenece' });
        }
        notificacion.aceptada = true;
        if (await notificacion.save()) {
            await sala.related('users').attach([user.id]);
            return response.status(200).json({ message: 'Invitacion aceptada' });
        }
        return response.status(400).json({ messaje: "Error al aceptar invitacion" });
    }
}
exports.default = SalasController;
//# sourceMappingURL=SalasController.js.map