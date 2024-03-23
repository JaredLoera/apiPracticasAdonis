import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Route from '@ioc:Adonis/Core/Route'
import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import Notificacion from 'App/Models/Notificacion'
import Message from 'App/Models/Message'
import Sala from 'App/Models/Sala'
export default class UsersController {
    public async getMessageSala({auth,response,request}:HttpContextContract){
        const sala = (await Sala.findOrFail(request.param('sala_id'))).related('users').query().where('user_id',auth.user!.id).first()
        if (!sala) {
            return response.status(400).json({message:'No puedes ver mensajes de salas que no perteneces'})
        }
      const mesages = await (Message.query().where('sala_id',request.param('sala_id'))).preload('user')
        return response.status(200).json(mesages)
    }
    public async createMessage({auth,response,request}:HttpContextContract){
    
        const sala = (await Sala.findOrFail(request.input('sala_id'))).related('users').query().where('user_id',auth.user!.id).first()
        if (!sala) {
            return response.status(400).json({message:'No puedes enviar mensajes a salas que no perteneces'})
        }
        const messageSchema = schema.create({
            message: schema.string({trim:true},[
                rules.required()
            ]),
            sala_id:schema.number([
                rules.required(),
                rules.exists({table:'salas',column:'id'})
            ])
        })
        try {
            await request.validate({
                schema: messageSchema,
                messages: {
                    required: 'El campo {{field}} es requerido',
                    exists: 'La sala no existe'
                }
            })
        } catch (error) {
            return response.status(400).json(error.messages)
        }
        const message = new Message()
        message.message = request.input('message')
        message.sala_id = request.input('sala_id')
        message.user_id = auth.user!.id
        if (await message.save()) {
            return response.status(201).json({ message: 'Mensaje creado' })
        }
        return response.status(500).json({ message: 'Error al crear mensaje' })
       
    }
    public async getNotification({auth,response}:HttpContextContract){
        const user = await auth.user
        const notificaciones = await Notificacion.query().where('user_id',user!.id)
        return response.status(200).json(notificaciones)
    }
    public async getUsers({ response }: HttpContextContract) {
        const users = await User.all()
        return response.status(200).json(users)
    }
    public async getProfile({ auth, response }: HttpContextContract) {
        const usuario = await auth.user
        const rol = await usuario?.related('rol').query().first()
        usuario!.rol_nombre = rol?.nombre!
        return response.status(200).json(usuario)
    }
    public async logout({ auth, response }: HttpContextContract) {
        await auth.use('api').revoke()
        return response.status(200).json({ message: 'Sesión cerrada' })
    }
    public async verifyEmail({ request, response }: HttpContextContract) {
        const id = request.param('id')
        const user = await User.findOrFail(id)
        if (request.hasValidSignature()) {
        user.it_is_verified = true
        if (await user.save()) {
            return response.status(200).json({ message: 'Email verificado' })
        }
        }
        return response.status(400).json({ message: 'Email no verificado' })
    }
    public async sendMailConfirmation({ auth }: HttpContextContract) {
        const user = await auth.user;
        var url = Route.makeSignedUrl('verifyUser', {id:user?.id},{expiresIn:'5m'})

        url = 'http://localhost:4200'+url
        
        await Mail.send((message) => {
            message
              .from('jaredsalazarloera@japsupport.com')
              .to('salazarloerajared@gmail.com')
              .subject('Welcome Onboard!')
              .htmlView('emails/welcome', { 
                user: { fullName: user?.email},
                url: url,
               })
          })
    }
    public async login({ request, response, auth }: HttpContextContract) {
        const loginReglasValidacion = schema.create({
            email: schema.string({ trim: true }, [
                rules.email(),
                rules.required()
            ]),
            password: schema.string({ trim: true }, [
                rules.required()
            ])
        })
        try {
            await request.validate({
                schema: loginReglasValidacion,
                messages: {
                    email: 'El campo email debe ser un correo válido',
                    required: 'El campo {{field}} es requerido',
                }
            })
        } catch (error) {
            return response.status(400).json(error.messages)
        }
        const email = request.input('email')
        const password = request.input('password')
        try {
            const token = await auth.use('api').attempt(email, password,{ expiresIn: '1 days'})
            return response.status(200).json(token)
        } catch (error) {
            return response.status(401).json({ message: 'Credenciales incorrectas' })
        }
    }
  
    public async createUser({ request, response }: HttpContextContract) {
        const userReglasValidacion = schema.create({
            email: schema.string({ trim: true }, [
                rules.email(),
                rules.unique({ table: 'users', column: 'email' }),
                rules.required()
            ]),
            password: schema.string({ trim: true }, [
                rules.minLength(8),
                rules.maxLength(255),
                rules.required()
            ])
        })
        try {
            await request.validate({
                schema: userReglasValidacion,
                messages: {
                    email: 'El campo email debe ser un correo válido',
                    'email.unique': 'El correo ya se encuentra registrado',
                    required: 'El campo {{field}} es requerido',
                }
            })
        } catch (error) {
            return response.status(400).json(error.messages)
        }
        const user = new User()
        user.email = request.input('email')
        user.password = request.input('password')
        if (await user.save()) {
            return response.status(200).json(user)
        }
        return response.status(400).json({ message: 'Error al crear el usuario' })
    }
}
