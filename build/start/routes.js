"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.get('/', async ({ view }) => {
    return view.render('home');
});
Route_1.default.group(() => {
    Route_1.default.get('/send-email-confirm', 'usersController.sendMailConfirmation');
    Route_1.default.post('/logout', 'usersController.logout');
    Route_1.default.get('/profile', 'usersController.getProfile');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('users', 'usersController.getUsers');
}).middleware(['auth', 'checkRol:Administrador']);
Route_1.default.get('/pelicula/:id/stream', 'PeliculasController.peliculaStream');
Route_1.default.get('/peliculas', 'PeliculasController.index');
Route_1.default.get('/ultimas-peliculas', 'PeliculasController.ultimasPeliculas');
Route_1.default.get('/generos', 'PeliculasController.generos');
Route_1.default.get('/genero/:genero', 'PeliculasController.genero');
Route_1.default.get('/peliculas/:genero', 'PeliculasController.peliculasGenero');
Route_1.default.post('/peliculas', 'PeliculasController.create');
Route_1.default.get('/pelicula/:id', 'PeliculasController.pelicula');
Route_1.default.post('/peliculas/:id/imagen', 'PeliculasController.guardarImagen');
Route_1.default.post('/salas', 'SalasController.createSalas').middleware('auth');
Route_1.default.get('/salas', 'SalasController.getMisSalas').middleware('auth');
Route_1.default.get('/salas/invitado', 'SalasController.getSalasInvitado').middleware('auth');
Route_1.default.post('/salas/invitacion', 'SalasController.invitacionToUnion').middleware('auth');
Route_1.default.get('/users/invitaciones', 'SalasController.myInvitations').middleware('auth');
Route_1.default.put('/users/invitaciones/aceptar', 'SalasController.aceptarInvitacion').middleware('auth');
Route_1.default.post('/message', 'usersController.createMessage').middleware('auth');
Route_1.default.get('/message/:sala_id', 'usersController.getMessageSala').middleware('auth');
Route_1.default.post('/register', 'usersController.createUser');
Route_1.default.post('/login', 'usersController.login');
Route_1.default.get('/verify-mail/:id', 'usersController.verifyEmail').as('verifyUser');
//# sourceMappingURL=routes.js.map