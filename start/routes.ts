import Route from '@ioc:Adonis/Core/Route'



Route.group(() => {
    Route.get('/conductores', 'ConductoresController.getConductores')
    Route.post('/conductores', 'ConductoresController.saveConductor')
    Route.put('/conductores/:id', 'ConductoresController.activeConductorInService')
    Route.put('/conductores/finish/:id', 'ConductoresController.finishConductorService')
}).prefix('/api')
