"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'notificaciones';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('mensaje');
            table.boolean('leida').defaultTo(false);
            table.boolean('aceptada').defaultTo(false);
            table.boolean('rechazada').defaultTo(false);
            table.integer('sala_id').unsigned().references('id').inTable('salas').onDelete('CASCADE').onUpdate('CASCADE');
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
            table.integer('quien_envia_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
            table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
            table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1710153562181_notificaciones.js.map