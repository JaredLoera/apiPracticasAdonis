"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CheckRol {
    async handle({ auth, response }, next, permitidos) {
        const user = await auth.authenticate();
        const rol = await user.related('rol').query().first();
        for (let permitido of permitidos) {
            if (rol?.nombre == permitido) {
                await next();
                return;
            }
        }
        response.unauthorized({ message: 'No tienes permisos para realizar esta acción' });
    }
}
exports.default = CheckRol;
//# sourceMappingURL=CheckRol.js.map