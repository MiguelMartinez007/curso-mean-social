'use strict'

var jwt = require('jwt-simple'); /* Variable para generar servicios */
var moment = require('moment'); /* Variable para generar fechas */
var secret = 'clave_secreta'; /* Esta variable sera la clave sercreta con la que se encriptaran los datos del usuario */

/* Se define una funcion que se quiere exportar */
exports.createToken = function(user) {
    /* Contendra un objeto con los datos del usuario que se quiere codificar */
    var payload = {
        /* Identificador del documento */
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        /* Formato de tiempo */
        iat: moment().unix(),
        /* A la fecha actual se le agregan 30 dias */
        exp: moment().unix(30, 'days').unix
    };

    return jwt.encode(payload, secret); /* Codifica todos los datos y debueve un string encriptado */
};