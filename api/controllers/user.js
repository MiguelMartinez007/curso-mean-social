'use strict'

var bcrypt = require('bcrypt-nodejs'); /* Nos permitira sifrar las contrasenas */

/* Se importa el modelo de usuario */
var User = require('../models/user');
/* Importamos el servicio que genera el tocken para encriptar los datos del usuario */
var jwt = require('../services/jwt');

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

    /* En caso de que lo que se esta enviando es verdadero y copleto */
    if (params.name && params.surname && params.nick && params.email && params.password) {
        /* Compribamos que no exista un usuario ya registrado con el mismo correo */
        User.findOne({ email: params.email }, (err, user) => {
            if (err) return res.status(500).send({ message: 'Error en la petición' });

            if (!user) {
                var user = new User(); /* Creamos un nuevo objeto de tipo usuario */

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
                            userStored.password = undefined;
                            res.status(200).send({ user: userStored }); /* Se debuelve un objeto con el objeto de usuario */
                        } else {
                            /* en caos de que el userStored este mal */
                            res.status(404).send({ message: 'No se ha registrado el usuario' });
                        }
                    })
                }); /* Encriptamos la contrasena */
            } else {
                return res.status(200).send('El correo de usuario ya existe');
            }
        });

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

    /* Comparamos que exista un registro con este correo electronico, este metodo debuelve un error y un usuario */
    User.findOne({ email: email }, (err, user) => {
        /* En caso de que exita un error en la peticion se precenta el siguient mensaje */
        if (err) return res.status(500).send({ message: 'Error en la petición' });
        /* En caso de que no exista ningun error se verifica que exista un usuario */
        if (user) {
            /* Com pa libreria de bcrypt se compara la contrasena para saver si esta coinside con la de la base de datos */
            bcrypt.compare(password, user.password, (err, check) => {
                /* Se comprueba que si son iguales las contrasenas */
                if (check) {

                    if (params.gettoken) {
                        // Generar y devolver el token
                        return res.status(200).send({
                            tocken: jwt.createToken(user)
                        });

                    } else {
                        // Devolver datos del usuario
                        user.password = undefined; /* Nos permite quitar un elemento */
                        // Devolber datos de usuario
                        return res.status(200).send({ user });
                    }
                } else { /* En caso de que no sean iguales las contrasenas se debuelve el siguient mensaje */
                    return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
                }
            });
        } else { /* En caso de que no exista un usuario debuelto se muestra el siguiente error */
            return res.status(404).send({ message: 'El usuario no se ha podido identificar!!' });
        }
    })
};

/* Se exportan los metodoes en formato json */
module.exports = {
    /* Mensaje */
    home,
    /* Mensaje */
    pruebas,
    /* Registra usuario */
    saveUser,
    /* Accede usuario */
    loginUser
};