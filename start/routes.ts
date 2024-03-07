import Route from '@ioc:Adonis/Core/Route'
Route.get('/users', 'usersController.getUsers').middleware('auth')

Route.group(() => {
    Route.get('/send-email-confirm', 'usersController.sendMailConfirmation')
    Route.post('/logout', 'usersController.logout')
    Route.get('/profile', 'usersController.getProfile')
}).middleware('auth')

Route.get('/peliculas', 'PeliculasController.index')
Route.post('/peliculas', 'PeliculasController.create')
Route.post('/peliculas/:id/imagen', 'PeliculasController.guardarImagen')

Route.post('/register', 'usersController.createUser')
Route.post('/login', 'usersController.login')
Route.get('/verify-mail/:id','usersController.verifyEmail').as('verifyUser')
