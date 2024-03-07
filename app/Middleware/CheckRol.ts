import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckRol {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>, permitidos: string[]) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const user = await auth.authenticate()
    const rol = await user.related('rol').query().first()
    for (let permitido of permitidos) {
      if (rol?.nombre == permitido) {
        await next()
        return
      }
    }
    response.unauthorized({ message: 'No tienes permisos para realizar esta acción' })
  }
}
