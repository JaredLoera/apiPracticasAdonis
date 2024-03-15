import { DateTime } from 'luxon'
import { BaseModel, column, hasOne,HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Notificacion extends BaseModel {
  public static table = 'notificaciones'

  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public sala_id: number

  @column()
  public mensaje: string

  @column()
  public leida: boolean

  @column()
  public aceptada: boolean

  @column()
  public rechazada: boolean

  @column()
  public quien_envia_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime 

  @hasOne(() => User, {
    foreignKey: 'id',
    localKey: 'quien_envia_id'
  })
  public quien_envia: HasOne<typeof User>
}
