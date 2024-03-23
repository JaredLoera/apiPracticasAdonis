"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Notificacion_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Notificacion"));
const Message_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Message"));
const Sala_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Sala"));
class UsersController {
    async getMessageSala({ auth, response, request }) {
        const sala = (await Sala_1.default.findOrFail(request.param('sala_id'))).related('users').query().where('user_id', auth.user.id).first();
        if (!sala) {
            return response.status(400).json({ message: 'No puedes ver mensajes de salas que no perteneces' });
        }
        const mesages = await (Message_1.default.query().where('sala_id', request.param('sala_id'))).preload('user');
        return response.status(200).json(mesages);
    }
    async createMessage({ auth, response, request }) {
        const sala = (await Sala_1.default.findOrFail(request.input('sala_id'))).related('users').query().where('user_id', auth.user.id).first();
        if (!sala) {
            return response.status(400).json({ message: 'No puedes enviar mensajes a salas que no perteneces' });
        }
        const messageSchema = Validator_1.schema.create({
            message: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.required()
            ]),
            sala_id: Validator_1.schema.number([
                Validator_1.rules.required(),
                Validator_1.rules.exists({ table: 'salas', column: 'id' })
            ])
        });
        try {
            await request.validate({
                schema: messageSchema,
                messages: {
                    required: 'El campo {{field}} es requerido',
                    exists: 'La sala no existe'
                }
            });
        }
        catch (error) {
            return response.status(400).json(error.messages);
        }
        const message = new Message_1.default();
        message.message = request.input('message');
        message.sala_id = request.input('sala_id');
        message.user_id = auth.user.id;
        if (await message.save()) {
            return response.status(201).json({ message: 'Mensaje creado' });
        }
        return response.status(500).json({ message: 'Error al crear mensaje' });
    }
    async getNotification({ auth, response }) {
        const user = await auth.user;
        const notificaciones = await Notificacion_1.default.query().where('user_id', user.id);
        return response.status(200).json(notificaciones);
    }
    async getUsers({ response }) {
        const users = await User_1.default.all();
        return response.status(200).json(users);
    }
    async getProfile({ auth, response }) {
        const usuario = await auth.user;
        const rol = await usuario?.related('rol').query().first();
        usuario.rol_nombre = rol?.nombre;
        return response.status(200).json(usuario);
    }
    async logout({ auth, response }) {
        await auth.use('api').revoke();
        return response.status(200).json({ message: 'Sesión cerrada' });
    }
    async verifyEmail({ request, response }) {
        const id = request.param('id');
        const user = await User_1.default.findOrFail(id);
        if (request.hasValidSignature()) {
            user.it_is_verified = true;
            if (await user.save()) {
                return response.status(200).json({ message: 'Email verificado' });
            }
        }
        return response.status(400).json({ message: 'Email no verificado' });
    }
    async sendMailConfirmation({ auth }) {
        const user = await auth.user;
        var url = Route_1.default.makeSignedUrl('verifyUser', { id: user?.id }, { expiresIn: '5m' });
        url = 'http://localhost:4200' + url;
        await Mail_1.default.send((message) => {
            message
                .from('jaredsalazarloera@japsupport.com')
                .to('salazarloerajared@gmail.com')
                .subject('Welcome Onboard!')
                .htmlView('emails/welcome', {
                user: { fullName: user?.email },
                url: url,
            });
        });
    }
    async login({ request, response, auth }) {
        const loginReglasValidacion = Validator_1.schema.create({
            email: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.email(),
                Validator_1.rules.required()
            ]),
            password: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.required()
            ])
        });
        try {
            await request.validate({
                schema: loginReglasValidacion,
                messages: {
                    email: 'El campo email debe ser un correo válido',
                    required: 'El campo {{field}} es requerido',
                }
            });
        }
        catch (error) {
            return response.status(400).json(error.messages);
        }
        const email = request.input('email');
        const password = request.input('password');
        try {
            const token = await auth.use('api').attempt(email, password, { expiresIn: '1 days' });
            return response.status(200).json(token);
        }
        catch (error) {
            return response.status(401).json({ message: 'Credenciales incorrectas' });
        }
    }
    async createUser({ request, response }) {
        const userReglasValidacion = Validator_1.schema.create({
            email: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.email(),
                Validator_1.rules.unique({ table: 'users', column: 'email' }),
                Validator_1.rules.required()
            ]),
            password: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.minLength(8),
                Validator_1.rules.maxLength(255),
                Validator_1.rules.required()
            ])
        });
        try {
            await request.validate({
                schema: userReglasValidacion,
                messages: {
                    email: 'El campo email debe ser un correo válido',
                    'email.unique': 'El correo ya se encuentra registrado',
                    required: 'El campo {{field}} es requerido',
                }
            });
        }
        catch (error) {
            return response.status(400).json(error.messages);
        }
        const user = new User_1.default();
        user.email = request.input('email');
        user.password = request.input('password');
        if (await user.save()) {
            return response.status(200).json(user);
        }
        return response.status(400).json({ message: 'Error al crear el usuario' });
    }
}
exports.default = UsersController;
//# sourceMappingURL=UsersController.js.map