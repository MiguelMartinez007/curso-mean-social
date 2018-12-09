'use strict'
/* En esta parte se creara un modelo para lo que son los mensajes */

var mongoose = require('mongoose');
var Schema = mongoose.Schema; /* Esto nos permite definri un nuevo esquema */
/* Se crea el esquema nuevo */
var messagesSchema = Schema({
    text: String,
    create_at: String,
    user: { type: Schema.ObjectId, ref: 'User' },
    followed: { type: Schema.ObjectId, ref: 'User' }
});

// Exportamos
/* En esta parte se exporta el modelo en formato json para que este diponible en cualquier sitio */
modules.exports = mongoose.model('Message', messagesSchema);