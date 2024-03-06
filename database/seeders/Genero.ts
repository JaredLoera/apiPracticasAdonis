import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Genero from 'App/Models/Genero'

export default class extends BaseSeeder {
  public async run () {
    await Genero.createMany([
      {nombre: 'Accion'},
      {nombre: 'Comedia'},
      {nombre: 'Drama'},
      {nombre: 'Terror'},
      {nombre: 'Ciencia Ficcion'}])
  }
}
