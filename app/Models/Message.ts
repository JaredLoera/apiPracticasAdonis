import { DateTime } from 'luxon'
import { BaseModel, column,hasOne,HasOne } from '@ioc:Adonis/Lucid/Orm'
import Sala from './Sala'
import User from './User'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public message: string

  @column()
  public user_id: number

  @column()
  public sala_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => User,{
    foreignKey: 'id',
    localKey: 'user_id'
  })
  public user: HasOne<typeof User>
  
  @hasOne(() => Sala,{
    foreignKey: 'id',
    localKey: 'sala_id'
  })
  public sala: HasOne<typeof Sala>
}
