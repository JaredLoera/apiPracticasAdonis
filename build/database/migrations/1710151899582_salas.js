"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'salas';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('nombre').notNullable();
            table.integer('user_id').unsigned().notNullable();
            table.integer('pelicula_id').unsigned().notNullable();
            table.boolean('pausada').defaultTo(false);
            table.boolean('status').defaultTo(true);
            table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
            table.foreign('pelicula_id').references('id').inTable('peliculas').onDelete('CASCADE').onUpdate('CASCADE');
            table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
            table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1710151899582_salas.js.map