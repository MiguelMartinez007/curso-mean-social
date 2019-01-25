'use strict'

var moment = require('moment');
var mongoosePagination = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function probando(req, res) {
    res.status(200).send({message: 'Hola que tal desde los mensajes pribados'});
}

// Envia los mensajes entre los usuarios
function saveMessage(req, res) {
    var params = req.body;
    
    // Ver si existen estas propiedades
    if (!params.text && !params.receiver) return res.status(200).send({message: 'Envia los datos necesarios'});

    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.create_at = moment().unix();

    message.save((err, messageStored) => {
        if (err) return res.status(500).send({message: 'Error en la petición'});
        if (!messageStored) return res.status(500).send({message: 'Error al eviar el mensaje'});

        return res.status(200).send({message: messageStored});
    });
}

module.exports = {
    // Metodo de prueba
    probando,
    // Metodo para enviar mensaje entre los usuarios
    saveMessage
}