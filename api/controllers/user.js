'use strict'

/* Se importa el modelo de usuario */
var User = require('../models/user');

// rutas
function home(req, res) {
    console.log(req.body); /* Se hace una impresion del objeto json */

    res.status(200).send({
        message: 'Hola mundo desde el servidor de nodejs'
    });
};

function pruebas(req, res) {
    res.status(200).send({
        message: 'Accion de pruebas en el servidor'
    });
};

/* Se exportan los metodoes en formato json */
module.exports = {
    home,
    pruebas
};