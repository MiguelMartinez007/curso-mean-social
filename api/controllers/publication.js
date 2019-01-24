// Se encarga de todas las acciones que tienen que ver con crear las publicaciones y
// todo lo que tiene que ver con las publicaciones
'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function probando(req, res){
    res.status(200).send({
        message: 'Hola desde el controlador de publicaciones'
    });
}

// Guarda nuevas publicaciones
function savePublication(req, res){
    // Recojemos los parametros que nos llegan desde el body
    var params = req.body;

    // En caso de que no nos llegue ningun texto de publicacion
    if(!params.text) return res.status(200).send({message:'Debes de enviar un texto'});

    // Se crea una nueva instancia del objeto publicacion
    var publication = new Publication();
    publication.text = params.text;
    publication.file = null;
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if(err) return res.status(500).send({message:'Error al guardar la publicación'});
        if(!publicationStored) res.status(404).send({message:'La publicación no ha sido guardada'});
        res.status(200).send({publication: publicationStored});
    })
}

// Nos permite listar las publicaciones de los usuarios que estamos siguiendo
// Se utiliza en el timeline de la aplicacion
function getPublications(req, res){
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;

    // Con populate se cargan los datos del objeto al que esta relacionado la propiedad que se pasa
    Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) => {
        if(err) return res.status(500).send({message:'Error al devolver el seguimiento'});
        
        // Se crea un arra que devuelve los usuarios que estamos siguiendo
        var followsClean = [];

        follows.forEach((follow) => {
            // Se esta añidiendo un objeto completo
            followsClean.push(follow.followed);
        });

        // En esta parte: {"$in": followsClean, se crea el codigo para filtrar las publicaciones de los usuarios que coinsidan con el arreglo
        // followsClean. Se compara el id de user en la parte de publication, despues de agrega un sort para ordenar las publicaciones de 
        // la mas resiente a la mas antigua, despues de crea un populate para extraer todo el objeto de cada publicacion, y finalmente se pagina
        // para tener la informacion en paginas y cargarla dinamicamente en el front
        Publication.find({user: {"$in": followsClean}}).sort('created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            if(err) return res.status(500).send({message:'Error al devolver publicaciones'});

            if(!publications) return res.status(404).send({message:'No hay publicaciones'});

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page,
                publications
            });
        });
        
    });
}

// Metodo para debolver una publicacion, nos da una publicacion en base a su id
function getPublication(req, res) {
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if(err) return res.status(500).send({message:'Error al devolver la publicacion'});

        if(!publication) return res.status(404).send({message:'No existe la publicación'});

        res.status(200).send({publication});
    });
}

module.exports = {
    probando,
    // Guardar una publicacion nueva
    savePublication,
    // Carga una lista de publicaciones de usuarios que estamos siguiendo
    getPublications,
    // Nos arroja una publicación buscada por su id
    getPublication
}