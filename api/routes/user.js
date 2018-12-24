'use strict'

/* Rutas del controlador de usuarios */
var express = require('express'); /* Cargamos express para las rutas */
var userCotrollers = require('../controllers/user'); /* Es el que contiene las funciones a las que nos mandaran las rutas */

var api = express.Router(); /* Con esto se tiene acceso a las rutas que se carguen en express */
var md_auth = require('../middlewares/authenticated');

/* Se le carga un metodo por el metodo get
    Se se indica principalmente cual es la diraccion que tendra y despues la funcion
    que ejecutara, en este caso la de controlador de usuarios la funcion home */
api.get('/home', userCotrollers.home);

/* Creamos una nueva ruta */
api.get('/pruebas', md_auth.ensureAuth, userCotrollers.pruebas);
api.post('/register', userCotrollers.saveUser);
api.post('/login', userCotrollers.loginUser);
api.get('/user/:id', md_auth.ensureAuth, userCotrollers.getUsers);

/* Finalmente exportamos api */
module.exports = api;