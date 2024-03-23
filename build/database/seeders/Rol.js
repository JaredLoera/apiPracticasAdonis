"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Rol_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Rol"));
class default_1 extends Seeder_1.default {
    async run() {
        await Rol_1.default.createMany([
            { nombre: 'Administrador' },
            { nombre: 'Viewer' },
            { nombre: 'Premium' }
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=Rol.js.map