import { DateTime } from 'luxon'
import { BaseModel, column,belongsTo,BelongsTo } from '@ioc:Adonis/Lucid/Orm'

export default class Genero extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nombre: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Genero)
  public genero: BelongsTo<typeof Genero>
}
