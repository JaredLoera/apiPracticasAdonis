import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'salas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre').notNullable();
      table.integer('user_id').unsigned().notNullable();
      table.integer('pelicula_id').unsigned().notNullable();
      table.boolean('pausada').defaultTo(false);
      table.boolean('status').defaultTo(true);
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE'); 
      table.foreign('pelicula_id').references('id').inTable('peliculas').onDelete('CASCADE').onUpdate('CASCADE');
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
