const fs = require('fs');
const path = require('path');
const express = require('express');
const { authentication } = require('../middlewares');
const utils = require('../helpers/utils');
const CONTROLLER_DIR = '../controller/src';
const rateLimit = require('express-rate-limit')
const configuration = require('../config/config.js')
class Router {
  constructor(app, config) {
    this.app = app;
    this.config = config;
  }

  initialize() {
    this.app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');

      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
    });
    // this.app.use(rateLimit({
    //   windowMs: 5 * 60 * 1000, // 5 minutes
    //   message: { status: 429, message: 'Too many requests, please try again later.' },
    //   max: configuration.NODE_ENV === "stable" ? 150 : 300, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
    //   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    //   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // }));
    this.initDocs();
    const privateControllers = [];
    const publicControllers = [];
    const dir = path.join(__dirname, CONTROLLER_DIR);
    this.getControllers(dir, privateControllers, publicControllers);
    this.injectControllers(publicControllers);
    this.app.use(authentication);
    this.injectControllers(privateControllers);
  }

  getControllers(dir, privateControllers, publicControllers) {
    const files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i += 1) {
      const controllerDir = path.join(dir, files[i]);
      if (fs.lstatSync(controllerDir).isDirectory()) {
        this.getControllers(controllerDir, privateControllers, publicControllers);
      } else {
        const controller = require(controllerDir);
        if (controller.type === 'private') {
          privateControllers.push(controller);
        } else {
          publicControllers.push(controller);
        }
      }
    }
  }

  injectControllers(controllers) {
    for (let i = 0; i < controllers.length; i += 1) {
      this.app.use(controllers[i].url, controllers[i].router);
    }
  }

  initDocs() {
    if (utils.inDevelopment()) {
      const files = path.join(__dirname, '../docs/swagger-ui');
      const pub = path.join(__dirname, '../public');
      const oaSpecs = path.join(__dirname, '../api.yaml');
      this.app.use('/swagger-ui', express.static(files));
      this.app.use('/swagger-ui/api.yaml', express.static(oaSpecs));
      this.app.use('/pu/', express.static(pub));
    }
  }
}

module.exports = Router;
