'use strict'

var jwt = require('jwt-simple'); /* Variable para generar servicios */
var moment = require('moment'); /* Variable para generar fechas */

/* Se define una funcion que se quiere exportar */
exports.createToken = function(user) {
    /* Contendra un objeto con los datos del usuario que se quiere codificar */
    var payload = {
        /* Identificador del documento */
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        /* Formato de tiempo */
        iat: moment().unix(),
    };
};