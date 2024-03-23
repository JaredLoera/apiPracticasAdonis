import Route from '@ioc:Adonis/Core/Route'


Route.get('/', async ({ view }) => {
    return view.render('home')
  })

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

//PARA SALAS

Route.post('/salas', 'SalasController.createSalas').middleware('auth')
Route.get('/salas', 'SalasController.getMisSalas').middleware('auth')
Route.get('/salas/invitado', 'SalasController.getSalasInvitado').middleware('auth')
Route.post('/salas/invitacion', 'SalasController.invitacionToUnion').middleware('auth')
Route.get('/users/invitaciones', 'SalasController.myInvitations').middleware('auth')
Route.put('/users/invitaciones/aceptar', 'SalasController.aceptarInvitacion').middleware('auth')

//PARA MENSAJES
Route.post('/message', 'usersController.createMessage').middleware('auth')
Route.get('/message/:sala_id', 'usersController.getMessageSala').middleware('auth')



Route.post('/register', 'usersController.createUser')
Route.post('/login', 'usersController.login')
Route.get('/verify-mail/:id','usersController.verifyEmail').as('verifyUser')
