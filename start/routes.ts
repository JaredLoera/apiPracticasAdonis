import Route from '@ioc:Adonis/Core/Route'







Route.get('/users', 'usersController.getUsers').middleware('auth')

Route.group(() => {
    Route.get('/send-email-confirm', 'usersController.sendMailConfirmation')
    Route.get('/conductores', 'ConductoresController.getConductores')
    Route.post('/conductores', 'ConductoresController.saveConductor')
    Route.put('/conductores/:id', 'ConductoresController.activeConductorInService')
    Route.put('/conductores/finish/:id', 'ConductoresController.finishConductorService')

    Route.post('/logout', 'usersController.logout')
    Route.get('/profile', 'usersController.getProfile')
}).middleware('auth')



Route.post('/register', 'usersController.createUser')
Route.post('/login', 'usersController.login')
Route.get('/verify-mail/:id','usersController.verifyEmail').as('verifyUser')
