'use strict'
/* En esta parte se creara un modelo para lo que son los follows o usuarios seguidos */

var mongoose = require('mongoose');
var Schema = mongoose.Schema; /* Esto nos permite definri un nuevo esquema */
/* Se crea el esquema nuevo */
var followsSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    followed: { type: Schema.ObjectId, ref: 'User' }
});

// Exportamos
/* En esta parte se exporta el modelo en formato json para que este diponible en cualquier sitio */
module.exports = mongoose.model('Follow', followsSchema);