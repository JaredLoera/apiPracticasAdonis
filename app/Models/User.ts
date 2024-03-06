import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import Rol from 'App/Models/Rol'
import { column, beforeSave, BaseModel, hasOne,
  HasOne } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public it_is_active: boolean
  
  @column()
  public it_is_verified: boolean

  @column()
  public rol_id: number

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
  @hasOne(() => Rol,{
    localKey: 'rol_id',
    foreignKey: 'id'
  })
  public rol: HasOne<typeof Rol>

}
