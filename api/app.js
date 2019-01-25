'use strict'
/* Aqui se tiene toda la configuracion de express */

var express = require('express'); /* Esto permitira trabajar con el protocolo HTTP */
var bodyParser = require('body-parser') /* Esto es para combertir las respuestas que lleguen de las peticiones a codigo javascript */

var app = express(); /* Nos carga el framework de express */

/* Se tendran varias secciones */

// Cargar rutas
var use_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var message_routes = require('./routes/message');

// middlewares
app.use(bodyParser.urlencoded({ extended: false })); /* Es un metodo que se ejecuta antes de que llegue a un cotrolador */
app.use(bodyParser.json()); /* Esto combertira la respuesta de la base de datos a un objeto json */

// cors

// rutas
/* Esta nos permite hacer midelwers, esta siempre se ejecuta antes de llegar a la accion del controlador 
    tambien nos permite hacer nuevas direcciones*/
app.use('/api', use_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);

// exportar
module.exports = app;