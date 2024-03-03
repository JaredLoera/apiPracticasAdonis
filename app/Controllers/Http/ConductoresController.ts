import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import Conductor from 'App/Models/Conductor';

export default class ConductoresController {
  public async finishConductorService({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const conductor = await Conductor.findOrFail(id)
    conductor.is_disponible = true
    if (await conductor.save()) {
      return response.status(200).json(conductor)
    }
    return response.status(400).json({ message: 'Error al poner disponible al conductor' })
  }

  public async activeConductorInService({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const conductor = await Conductor.findOrFail(id)
    conductor.is_disponible = false
    if (await conductor.save()) {
      return response.status(200).json(conductor)
    }
    return response.status(400).json({ message: 'Error al poner en viaje al onductor' })
  }
  public async getConductores({ response }: HttpContextContract) {
    const conductores = await Conductor.all()
    const numeroConductores = await Conductor.countNumberConductores()
    const numeroConductoresDisponibles = await Conductor.coutNumberConductoresDisponibles()
    const numeroConductoresNoDisponibles = await Conductor.countNumberConductoresNoDisponibles()
    const numeroConductoresEnViaje = await Conductor.countNumberConductoresEnViaje()
    const numeroConductoresInactivos = await Conductor.countNumberInactiveConductores()
    const numeroConductoresActivos = await Conductor.countNumberActiveConductores()
    return response.status(200).json({ numeroConductoresActivos, numeroConductoresInactivos, numeroConductoresEnViaje, numeroConductoresDisponibles, numeroConductores, numeroConductoresNoDisponibles, conductores })
  }
  public async saveConductor({ request, response }: HttpContextContract) {
    const conductorReglasValidacion = schema.create({
      nombre: schema.string({ trim: true }, [
        rules.minLength(3),
        rules.maxLength(255),
      ]),
      apellido: schema.string({ trim: true }, [
        rules.minLength(3),
        rules.maxLength(255),
      ]),
      cedula: schema.string({ trim: true }, [
        rules.minLength(3),
        rules.maxLength(255),
        rules.unique({ table: 'conductores', column: 'cedula' })
      ]),
      telefono: schema.string({ trim: true }, [
        rules.minLength(3),
        rules.maxLength(255),
      ])
    })

    try {
      await request.validate({
        schema: conductorReglasValidacion,
        messages: {
          requered: 'El campo {{ field }} es requerido',
          minLength: 'El campo {{ field }} debe ser mayor a {{ options.minLength }} caracteres',
          maxLength: 'El campo {{ field }} debe ser menor a {{ options.maxLength }} caracteres',
          unique: 'El campo {{ field }} ya existe'
        }
      })
    } catch (error) {
      return response.badRequest(error.messages)
    }

    const conductor = new Conductor();
    conductor.nombre = request.input('nombre');
    conductor.apellido = request.input('apellido');
    conductor.cedula = request.input('cedula');
    conductor.telefono = request.input('telefono');

    if (await conductor.save()) {
      return response.status(201).json({ message: 'Conductor creado con exito' })
    }
    return response.status(400).json({ message: 'Error al crear el conductor' })
  }
}
