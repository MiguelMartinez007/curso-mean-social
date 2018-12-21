'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta'; /* Esta variable sera la clave sercreta con la que se encriptaran los datos del usuario */

/* Se define una funcion anonima
    la cual tendra por propiedades, los datos que recibe la aplicacion (req), la respuesta que estaremos dando (res) y
    la funcionalidad que permite saltar a otra cosa (next) */
exports.ensureAuth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La peticion no tiene la cabezera de autenticacion' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        /* Decodificar el payload */
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'El token ha expirado'
            });
        }
    } catch (error) {
        return res.status(404).send({
            message: 'El token no es valido'
        });
    }

    req.user = payload;

    next();
}