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

// Metodo para listar los mensajes recibidos
function getReceivedMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;
    if(req.params.page) page = req.params.page;

    var itemsPerPage = 4;

    // Al utilizar el populate, se le puede decir solamente cuales campos se quiere devolver: 'name surname _id nick image'
    Message.find({receiver: userId}).populate('emitter', 'name surname _id nick image').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({message: 'Error en la petición'});
        if (!messages) return res.status(404).send({message: 'No hay mensajes'});

        // messages.emitter.password = undefined;

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        });
    });
}

// Metodo para listar los mensajes enviados
function getEmitMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;
    if(req.params.page) page = req.params.page;

    var itemsPerPage = 4;

    // Al utilizar el populate, se le puede decir solamente cuales campos se quiere devolver: 'name surname _id nick image'
    Message.find({emitter: userId}).populate('emitter receiver', 'name surname _id nick image').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({message: 'Error en la petición'});
        if (!messages) return res.status(404).send({message: 'No hay mensajes'});

        // messages.emitter.password = undefined;

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        });
    });
}

module.exports = {
    // Metodo de prueba
    probando,
    // Metodo para enviar mensaje entre los usuarios
    saveMessage,
    // Lista los mensajes recibidos
    getReceivedMessages,
    // Lista los mensajes enviados
    getEmitMessages
}