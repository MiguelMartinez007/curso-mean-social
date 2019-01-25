'use strict'

var express = require('express');
var messageController = require('../controllers/message');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/probando-md', md_auth.ensureAuth, messageController.probando);
api.post('/message', md_auth.ensureAuth, messageController.saveMessage);

module.exports = api;