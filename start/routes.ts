import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/send-email-confirm', 'usersController.sendMailConfirmation')
    Route.post('/logout', 'usersController.logout')
    Route.get('/profile', 'usersController.getProfile')
}).middleware('auth')

Route.group(() => {
    Route.get('users', 'usersController.getUsers')
}).middleware(['auth','checkRol:Administrador'])

Route.get('/pelicula/:id/stream', 'PeliculasController.peliculaStream')

Route.get('/peliculas', 'PeliculasController.index')
Route.get('/ultimas-peliculas', 'PeliculasController.ultimasPeliculas')
Route.get('/generos', 'PeliculasController.generos')
Route.get('/genero/:genero', 'PeliculasController.genero')
Route.get('/peliculas/:genero', 'PeliculasController.peliculasGenero')
Route.post('/peliculas', 'PeliculasController.create')
Route.get('/pelicula/:id', 'PeliculasController.pelicula')
Route.post('/peliculas/:id/imagen', 'PeliculasController.guardarImagen')

Route.post('/register', 'usersController.createUser')
Route.post('/login', 'usersController.login')
Route.get('/verify-mail/:id','usersController.verifyEmail').as('verifyUser')
