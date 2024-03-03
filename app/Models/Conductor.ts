import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Conductor extends BaseModel {
  public static table = 'conductores'
  @column({ isPrimary: true })
  public id: number

  @column()
  public nombre: string

  @column()
  public apellido: string

  @column()
  public cedula: string

  @column()
  public telefono: string

  @column()
  public it_is_active: boolean

  @column()
  public is_disponible: boolean


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static async countNumberConductores() {
    return await Conductor.query().getCount();
  }
  public static async coutNumberConductoresDisponibles() {
    return await Conductor.query().where('is_disponible', true ).andWhere('it_is_active', true).getCount()
  }
  public static async countNumberConductoresNoDisponibles() {
    return await Conductor.query().where('is_disponible', false).andWhere('it_is_active', false).getCount()
  }
  public static async countNumberConductoresEnViaje() {
    return await Conductor.query().where('is_disponible', false).where('it_is_active', true).getCount()
  }
  public static async countNumberInactiveConductores() {
    return await Conductor.query().where('it_is_active', false).getCount()
  }
  public static async countNumberActiveConductores() {
    return await Conductor.query().where('it_is_active', true).getCount()
  }
}
