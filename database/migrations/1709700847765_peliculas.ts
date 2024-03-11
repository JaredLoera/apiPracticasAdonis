import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'peliculas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('titulo').notNullable();
      table.text('descripcion');
      table.date('fecha_estreno');
      //guardar imagen pelicula en base de datos
      table.string('imagen_url');
      table.string('video_url');
      
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })

     this.schema.createTable('genero_pelicula', (table) => {
      table.increments();
      table.integer('pelicula_id').unsigned().references('id').inTable('peliculas').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('genero_id').unsigned().references('id').inTable('generos').onDelete('CASCADE').onUpdate('CASCADE');

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    });
  }
  

  public async down () {
    this.schema.dropTable(this.tableName)
    this.schema.dropTable('genero_pelicula')
  }
}
