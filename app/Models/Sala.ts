import { DateTime } from 'luxon'
import {
  BaseModel, column, manyToMany,
  ManyToMany, HasOne, hasOne
} from '@ioc:Adonis/Lucid/Orm'

import User from './User'

export default class Sala extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nombre: string

  @column()
  public status: boolean

  @column()
  public user_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => User, {
    localKey: 'user_id',
    foreignKey: 'id'
  })
  public user: HasOne<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'sala_user',
    localKey: 'id',
    pivotForeignKey: 'sala_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  public users: ManyToMany<typeof User>
}
