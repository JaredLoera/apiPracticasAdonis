import { DateTime } from 'luxon'
import { BaseModel, column,hasOne,HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Rol extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nombre: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => User,{
    localKey: 'id',
    foreignKey: 'id'
  })
  public user: HasOne<typeof User>
}
