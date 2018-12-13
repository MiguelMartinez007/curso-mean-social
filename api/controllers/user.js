'use strict'

var bcrypt = require('bcrypt-nodejs'); /* Nos permitira sifrar las contrasenas */

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

/* Funcion de registro */
function saveUser(req, res) {
    var params = req.body;
    var user = new User(); /* Creamos un nuevo objeto de tipo usuario */

    /* En caso de que lo que se esta enviando es verdadero y copleto */
    if (params.name && params.surname && params.nick && params.email && params.password) {
        /* Setea los valores de la variable user */
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash; /* Seteamos la variable de password con el nuevo hash generado con bcrypt */

            /* Se guarda el usuario en la base de datos */
            user.save((err, userStored) => { /* Se ejecuta esta funcion */
                /* Se ejecuta en caso de que marque un error */
                if (err) return res.status(500).send({ message: 'Error al guardar el usuario' });
                /* Se ejecuta en caso de que todo sea exitoso */
                if (userStored) {
                    res.status(200).send({ user: userStored }); /* Se debuelve un objeto con el objeto de usuario */
                } else {
                    /* en caos de que el userStored este mal */
                    res.status(404).send({ message: 'No se ha registrado el usuario' });
                }
            })
        }); /* Encriptamos la contrasena */

    } else { /* en caso de que sean algunos valores falsos */
        /* Retorna un mensaje por consola, definiendo el error */
        res.status(200).send({
            message: 'Envia todos los campos necesarios!!'
        });
    }
};

/* Funcion para login */
function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    // Devolber datos de usuario
                    return res.status(200).send({ user });
                } else {
                    return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
                }
            });
        } else {
            return res.status(404).send({ message: 'El usuario no se ha podido identificar!!' });
        }
    })
};

/* Se exportan los metodoes en formato json */
module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser
};