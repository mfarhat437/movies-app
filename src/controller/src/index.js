const express = require('express');
const router = express.Router({ mergeParams: true });
const config = require('../../config/config.js');
const BaseController = require('../BaseController');

router.get('/', async (req, res) => res.send(config.app));

module.exports = new BaseController('/', 'public', router);
