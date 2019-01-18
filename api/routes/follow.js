'use strict'

var express = require('express');
var followControler = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/follow', md_auth.ensureAuth, followControler.saveFollows);
api.delete('/follow/:id', md_auth.ensureAuth, followControler.deleteFollow);
api.get('/following/:id?/:page?', md_auth.ensureAuth, followControler.getFolloginUsers);
api.get('/followed/:id?/:page?', md_auth.ensureAuth, followControler.getFollowedUsers);
api.get('/get-my-follows/:followed?', md_auth.ensureAuth, followControler.getMyFollows);

module.exports = api;