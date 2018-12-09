'use strict'

var express = require('express'); /* Esto permitira trabajar con el protocolo HTTP */
var bodyParser = require('body-parser') /* Esto es para combertir las respuestas que lleguen de las peticiones a codigo javascript */

var app = express(); /* Nos carga el framework de express */

/* Se tendran varias secciones */

// Cargar rutas

// middlewares
app.use(bodyParser.urlencoded({ extended: false })); /* Es un metodo que se ejecuta antes de que legue a un cotrolador */
app.use(bodyParser.json()); /* Esto combertira la respuesta de la base de datos a un objeto json */

// cors

// rutas
app.get('/', (req, res) => {
    console.log(req.body); /* Se hace una impresion del objeto json */

    res.status(200).send({
        message: 'Hola mundo desde el servidor de nodejs'
    });
});
app.get('/pruebas', (req, res) => {
    res.status(200).send({
        message: 'Accion de pruebas en el servidor'
    });
});

// exportar
module.exports = app;