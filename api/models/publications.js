'use strict'
/* En esta parte se creara un modelo para lo que son las publicacioes */

var mongoose = require('mongoose');
var Schema = mongoose.Schema; /* Esto nos permite definri un nuevo esquema */
/* Se crea el esquema nuevo */
var publicationSchema = Schema({
    text: String,
    file: String,
    created_at: String,
    user: { type: Schema.ObjectId, ref: 'User' }
});

// Exportamos
/* En esta parte se exporta el modelo en formato json para que este diponible en cualquier sitio */
module.exports = mongoose.model('Publication', publicationSchema);