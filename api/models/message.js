'use strict'
/* En esta parte se creara un modelo para lo que son los mensajes */

var mongoose = require('mongoose');
var Schema = mongoose.Schema; /* Esto nos permite definri un nuevo esquema */
/* Se crea el esquema nuevo */
var messagesSchema = Schema({
    text: String,
    viewed: String,
    create_at: String,
    emitter: { type: Schema.ObjectId, ref: 'User' },
    receiver: { type: Schema.ObjectId, ref: 'User' }
});

// Exportamos
/* En esta parte se exporta el modelo en formato json para que este diponible en cualquier sitio */
module.exports = mongoose.model('Message', messagesSchema);