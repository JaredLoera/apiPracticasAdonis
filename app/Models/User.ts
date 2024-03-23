import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import Rol from 'App/Models/Rol'
import { column, beforeSave, BaseModel, hasOne,
  HasOne,ManyToMany,manyToMany} from '@ioc:Adonis/Lucid/Orm'
import Sala from './Sala'
import Message from './Message'

export default class User extends BaseModel {
  public nombre_rol: string

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
  public rol_nombre: string

  @column()
  public salas_id: number

  @column()
  public sala_id: number

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
  @hasOne(() => Message,{
    foreignKey: 'id',
    localKey: 'user_id'
  })
  public message: HasOne<typeof Message>

    @hasOne(() => Sala,{
      foreignKey: 'id',
      localKey: 'sala_id'
    })
    public sala: HasOne<typeof Sala>

    @manyToMany(() => Sala,{
      pivotTable: 'sala_user',
      localKey: 'id',
      pivotForeignKey: 'user_id',
      relatedKey: 'id',
      pivotRelatedForeignKey: 'sala_id',
    })
    public salas: ManyToMany<typeof Sala>

  @hasOne(() => Rol,{
    localKey: 'rol_id',
    foreignKey: 'id'
  })
  public rol: HasOne<typeof Rol>

}
