const express = require('express');
const router = express.Router({ mergeParams: true });
const config = require('../../config/config.js');
const BaseController = require('../BaseController');
const path = require('path');

router.get('/', async (req, res) => res.send(config.app));
router.get('/docs', async (req, res, next) => {
    try {
      const view = path.join(__dirname, '../../docs/swagger-ui/index.html');
      return res.sendFile(view);
    } catch (err) {
      return next(err);
    }
  });
  
module.exports = new BaseController('/', 'public', router);
