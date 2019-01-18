'use strict'

// var path = require('path');
// var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

/* Cargamos los modelos */
var User = require('../models/user');
var Follow = require('../models/follow');

/* Sigue a un usuario */
function saveFollows(req, res) {
    var params = req.body; /* recojemos los datos de la peticion */

    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if (err) return res.status(500).send({ message: 'Error al guardar el seguimiento' });
        if (!followStored) return res.status(404).send({ message: 'El seguimiento no se ha guardado' });

        return res.status(200).send({ follow: followStored });
    })
}

/* Dejar de seguir a un usuario */
function deleteFollow(req, res) {
    var userId = req.user.sub;

    var followId = req.params.id;
    Follow.find({ 'user': userId, 'followed': followId }).remove((err) => {
        if (err) return res.status(500).send({ message: 'Error al guardar el seguimiento' });
        return res.status(200).send({ message: 'El follow se ha eliminado' });
    });
}

/* Lista los usuarios seguidos */
function getFolloginUsers(req, res) {
    var userId = req.user.sub;

    /* Comprueba si llega el parametro del usuario por la url
        en el caso de que nos llegue una id, en caso de que nos legue una id de usuario por la id,
        esa la utilizaremos para listar los usuarios seguidos del usuario, en caso de que no nos llegue nada
        listaremos los uaurios seguidos del usuario que esta logueado */
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    var itemsPerPage = 4;

    Follow.find({ user: userId }).populate({ path: 'followed' }).paginate(page, itemsPerPage, (err, follows, total) => {
        /* En el caso de que se produsca un error */
        if (err) return res.status(500).send({ message: 'Error en el servidor' });
        /* En e caso de que no alla follows */
        if (!follows) return res.status(404).send({ message: 'No estas siguiendo a ningun usuario' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows
        })
    });
}

/* Listado de seguidores */
function getFollowedUsers(req, res) {
    var userId = req.user.sub;

    /* Comprueba si llega el parametro del usuario por la url
        en el caso de que nos llegue una id, en caso de que nos legue una id de usuario por la id,
        esa la utilizaremos para listar los usuarios seguidos del usuario, en caso de que no nos llegue nada
        listaremos los uaurios seguidos del usuario que esta logueado */
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    var itemsPerPage = 4;

    Follow.find({ followed: userId }).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
        /* En el caso de que se produsca un error */
        if (err) return res.status(500).send({ message: 'Error en el servidor' });
        /* En e caso de que no alla follows */
        if (!follows) return res.status(404).send({ message: 'No te sigue ningun usuario' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows
        });
    });
}

/* Lista los usaurios sin paginar */
function getMyFollows(req, res) {
    var userId = req.user.sub;

    var find = Follow.find({ user: userId });

    if (req.params.followed) {
        find = Follow.find({ followed: userId });
    }

    find.populate('user followed').exec((err, follows) => {
        /* En el caso de que se produsca un error */
        if (err) return res.status(500).send({ message: 'Error en el servidor' });
        if (!follows) return res.status(404).send({ message: 'No te sigue ningun usuario' });

        return res.status(200).send({
            follows
        });
    });
}

module.exports = {
    /* Guarda follows */
    saveFollows,
    /* Elimina un follow */
    deleteFollow,
    /* Carga los usuarios que se estan siguiendo */
    getFolloginUsers,
    /* Lista los seguidores */
    getFollowedUsers,
    /* Lista de usuarios sinlistar */
    getMyFollows
}