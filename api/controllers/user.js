'use strict'

var bcrypt = require('bcrypt-nodejs'); /* Nos permitira sifrar las contrasenas */

/* Se importa el modelo de usuario */
var User = require('../models/user');
/* Importamos el servicio que genera el tocken para encriptar los datos del usuario */
var jwt = require('../services/jwt');
/* Cargamos la libreria de mongoose paginated */
var mongoosePaginate = require('mongoose-pagination');

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

/* Coseguir datos de un usuario */
function getUser(req, res) {
    /* Cuando llegan datos por medio de get se utiliza params y cuando se hace por medio de post se utiliza bdy */
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        /* Si surge un error */
        if (err) return res.status(500).send({ message: 'Error en la petición' });
        /* Si el usuario no nos llega */
        if (!user) return res.status(404).send({ message: 'El usuario no existe' });
        /* Devuelve los datos del usuari en caso de que exista */
        return res.status(200).send({ user });
    });
}

/* Devuelve datos de usuarios paginados */
function getUsers(req, res) {
    var identity_user_id = req.user.sub; /* Se obtiene el id del usuario logueado */

    var page = 1;
    /* Comprobamos que nos llega por la url la pagina */
    if(req.params.page){
        /* Si existe un valor de page en los parametros entonces se cambia el valor de la vatiable page por el valor de los parametros resividos */
        page = req.params.page;
    }

    var itemsPerPage = 5; /* Va a ver 5 usuarios por pagina */
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        /* Si surge un error */
        if (err) return res.status(500).send({ message: 'Error en la petición' });
        /* Si el usuario no nos llega */
        if (!users) return res.status(404).send({ message: 'No hay usuarios disponibles' });
        /* Devuelve todos los usuarios */
        return res.status(200).send({
            users,
            total, /* Total de registros */
            pages: Math.ceil(total/itemsPerPage) /* Esto nos traera el total de paginas que se crearon */
        });
    });
}


/* Actualizar los datos de un usuario */
function updateUser(req, res) {
    var userId = req.params.id;

    var update = req.body; /* Se toman los nuevos datos */
    /* Se elimina la propiedad password de la variable update */
    delete update.password;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
    }

    /* Se manda una funcion calbak al servidor de Mongoose para que actualize los datos del usuario especificado con los datos nuevos, esto debuelve un objeto con los datos originales del usuario, y en caso de que se quiera obtener el nuevo objeto con los datos actualizados se escribe la siguiente instruccion */
    /* Instruccion: ,{new: true}, */
    User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdate) => {
        /* Si surge un error */
        if (err) return res.status(500).send({ message: 'Error en la petición' });
        /* Nos devuelve el usuario con los datos anteriores, en caso de que no debuelba nada se muestra el siguiente error */
        if(!userUpdate) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

        return res.status(200).send({
            user: userUpdate
        });
    });
}

/* Subir archivos de imagen avatar de usuario */
function uploadImage(req, res) {
    var userId = req.params.id;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
    }

    /* Si estamos enviando algun fichero */
    if(req.files){
        var file_path = req.files.image.path; /* Se toma la direccion del fichero */
        console.log(file_path);
        
        var file_split = file.path.split('\\'); /* Se toma el nombre del archivo */
    }
}

/* Se exportan los metodoes en formato json */
module.exports = {
    /* Mensaje */
    home,
    /* Mensaje */
    pruebas,
    /* Registra usuario */
    saveUser,
    /* Accede usuario */
    loginUser,
    /* Datos de un usuario */
    getUser,
    /* Datos de usuarios */
    getUsers,
    /* Actualizar usuario */
    updateUser,
    /* Sube archivo imagen del usuario */
    uploadImage
};