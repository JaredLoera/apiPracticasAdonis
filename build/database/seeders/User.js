"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
class default_1 extends Seeder_1.default {
    async run() {
        await User_1.default.createMany([
            {
                email: 'admin@gmail.com',
                password: '123456789',
                it_is_active: true,
                it_is_verified: true,
                rol_id: 1
            },
            {
                email: 'viewer@gmail.com',
                password: '123456789',
                it_is_active: true,
                it_is_verified: false,
                rol_id: 2
            }
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=User.js.map