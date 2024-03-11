import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Genero from './Genero'

export default class Pelicula extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public titulo: string

  @column()
  public descripcion: string

  @column.date()
  public fechaEstreno: DateTime

  @column()
  public imagen_url: string

  @column()
  public video_url: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Genero)
  public generos: ManyToMany<typeof Genero>
}
