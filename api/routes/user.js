'use strict'

/* Rutas del controlador de usuarios */
var express = require('express'); /* Cargamos express para las rutas */
var userCotrollers = require('../controllers/user'); /* Es el que contiene las funciones a las que nos mandaran las rutas */

var api = express.Router(); /* Con esto se tiene acceso a las rutas que se carguen en express */
var md_auth = require('../middlewares/authenticated');
/* Libreria para subida de archivos */
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' }); /* Se agrega la direccion donde se guardaran las imagenes que siban los usuarios */

/* Se le carga un metodo por el metodo get
    Se se indica principalmente cual es la diraccion que tendra y despues la funcion
    que ejecutara, en este caso la de controlador de usuarios la funcion home */
api.get('/home', userCotrollers.home);

/* Creamos nuevas rutas */
api.get('/pruebas', md_auth.ensureAuth, userCotrollers.pruebas);
api.post('/register', userCotrollers.saveUser);
api.post('/login', userCotrollers.loginUser);
api.get('/user/:id', md_auth.ensureAuth, userCotrollers.getUser);
api.get('/users/:page?', md_auth.ensureAuth, userCotrollers.getUsers);
api.get('/counters/:id?', md_auth.ensureAuth, userCotrollers.getCounters);
api.put('/update-user/:id', md_auth.ensureAuth, userCotrollers.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], userCotrollers.uploadImage);
api.get('/get-image-user/:imageFile', userCotrollers.getImageFile);

/* Finalmente exportamos api */
module.exports = api;