'use strict' /* Nos permite utilizar nuevs caracteristicas de javascript 6 */

var mongoose = require('mongoose'); /* Incorporamos la libreria de mongoos para hacer uso de la base de datos */
/* Importamos nuestro archivo 'app' el cual nos brindara todas las configuraciones de el servidor */
var app = require('./app'); /* Se tiene una variable con toda la configuracion de express */
var port = 3800; /* Se espesifica el puerto */

/* Conexion a la base de datos. En esta parte se lleva a cabo las sentencias que se
    necesitan para marcar la direccion de la bases de datos 
    a conectar. */
mongoose.Promise = global.Promise;
/* Aqui se marca la dirección de la BD, esto es una promesa por lo que tenemos funciones en
    caso de que retorne o no algo */
mongoose.connect('mongodb://localhost:27017/curso_mean_social', { useNewUrlParser: true })
    .then(() => {
        /* Esto se ejecuta en caso de que la conexion sea exitosa */
        console.log("La conexion a la base de datos se a realizado correctamente");

        /* Crear el servidor */
        app.listen(port, () => {
            console.log("El servidor corriendo en http://localhost:3800");

        });
    })
    .catch(err => console.log(err)); /* En caso de que no sea exitosa la conexion se manda el mensaje de los errores */