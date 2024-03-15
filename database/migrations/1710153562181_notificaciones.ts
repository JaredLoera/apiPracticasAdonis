import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'notificaciones'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('mensaje');
      table.boolean('leida').defaultTo(false);
      table.boolean('aceptada').defaultTo(false);
      table.boolean('rechazada').defaultTo(false);
      table.integer('sala_id').unsigned().references('id').inTable('salas').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('quien_envia_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
