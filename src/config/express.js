const bodyParser = require('body-parser');
const compress = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const errors = require('../helpers/errors/index');
const utils = require('../helpers/utils');
// eslint-disable-next-line max-lines-per-function
module.exports = (app, Router, config) => {
  // app.set('trust proxy', 1)
  // Disable powered by express
  app.disable('x-powered-by');
  app.disable('etag');
  // Express extensions
  app.use(cors());
  app.set("view engine", "ejs");
  // app.use(bodyParser.json({ limit: '5mb' }));
  app.use((req, res, next) => {
    if (req.originalUrl === '/webhook') {
      next();
    } else {
      bodyParser.json({ limit: '5mb' })(req, res, next);;
    }
  });

  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(mongoSanitize({
    replaceWith: '_',
  }));
  app.use(compress());

  // Finally we must initialize router
  const routers = new Router(app, config);
  routers.initialize();
  // catch 404 and forwarding to error handler
  app.use((req, res, next) => {
    const err = new errors.NotFoundError();
    next(err);
  });
  const report = (err, req) => {
    //send logs
  };
  // Error handling
  app.use((err, req, res, next) => {
    err.severity = (!err.status || err.status && err.status.toString().match(/^5\d{2}$/)) || (err.code && err.code.toString().match(/^5\d{2}$/)) ? "EMERGENCY" : "ERROR"
    report(err, req);
    const { message } = err;
    const payload = {
      code: err.code || 0,
      name: err.name,
      message: message || 'Error'
    };
    // Set res code based on error code or return 500
    res.statusCode = err.status || err.code || 500;
    const consoleErrorLogs = Object.assign({
      name: err.name,
      message: message || 'Error',
      body: req.body,
      statusCode: res.statusCode,
      stack_trace: err.stack,
      endPoint: req.originalUrl,
      severity: err.severity
    })
    console.error(JSON.stringify(consoleErrorLogs))

    if (err.status && err.status === 400) {
      // Handle ajv errors
      if (Array.isArray(err.message)) {
        payload.details = err.message;
        payload.message = 'validation error(s)';
      }
    }
    if (err.name === "CastError") {
      res.statusCode = 400
      payload.message = 'sent id is not valid'
    }
    payload.stack = err.stack;
    if (utils.inDevelopment()) {
      payload.stack = JSON.stringify(err.stack);
      return res.json(payload);
    }
    return res.json(payload);
  });
};
