'use strict'

/* Rutas del controlador de usuarios */
var express = require('express'); /* Cargamos express para las rutas */
var userCotrollers = require('../controllers/user'); /* Es el que contiene las funciones a las que nos mandaran las rutas */

var api = express.Router(); /* Con esto se tiene acceso a las rutas que se carguen en express */

/* Se le carga un metodo por el metodo get
    Se se indica principalmente cual es la diraccion que tendra y despues la funcion
    que ejecutara, en este caso la de controlador de usuarios la funcion home */
api.get('/home', userCotrollers.home);

/* Creamos una nueva ruta */
api.get('/pruebas', userCotrollers.pruebas);

/* Finalmente exportamos api */
module.exports = api;