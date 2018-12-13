'use strict'
/* En esta parte se creara un modelo para lo que son los usuarios */

var mongoose = require('mongoose');
var Schema = mongoose.Schema; /* Esto nos permite definri un nuevo esquema */
/* Se crea el esquema nuevo */
var userSchema = Schema({
    name: String,
    surname: String,
    nick: String,
    password: String,
    role: String,
    image: String,
});

// Exportamos
/* En esta parte se exporta el modelo en formato json para que este diponible en cualquier sitio */
module.exports = mongoose.model('User', userSchema);