require('dotenv').config({ path: require('find-config')('.env') });
const http = require('http');
const express = require('express');
const config = require('./src/config/config.js');
const mongo = require('./src/db/index');
const utils = require('./src/helpers/utils');
const path = require('path')
class Server {
  constructor(_config) {
    this.config = _config;
    this.app = express();
    this.server = http.createServer(this.app);
  }

  async preInitialize() {
    try {
      await mongo.initialize(this.config.db);
      await require('./src/services/core/MoviesSyncService.js').fetchMovies()
      await this.migrate()
    } catch (err) {
      console.log("err:", err);
      process.exit(1);
    }
    const expressRouter = require('./src/routes/index');
    const expressConfig = require('./src/config/express');
    expressConfig(this.app, expressRouter, this.config);
  }
  async start() {
    await this.preInitialize();
    await new Promise((resolve, reject) => {
      this.server.on('error', (err) => {
        if (err.syscall !== 'listen') {
          reject(err);
          return;
        }
        // handle specific listen errors with friendly messages
        switch (err.code) {
          case 'EACCES':
            console.error(`port ${err.port} requires elevated privileges`);
            process.exit(1);
            break;
          case 'EADDRINUSE':
            console.error(`port ${err.port} is already in use`);
            process.exit(1);
            break;
          default:
            reject(err);
        }
      });
      this.server.on('listening', () => {
        resolve();
      });
      this.server.listen(this.config.port);
    });
    const info = this.server.address();
    console.log(`Running API server at ${info.address}:${info.port} on ${config.NODE_ENV}`);
  }

  async stop() {
    if (!utils.inDevelopment() && !utils.inTest()) {
      return;
    }

    if (this.server && this.server.listening) {
      await mongo.close();
      // await socket.close();
      this.server.close();
    }
  }

  async migrate() {
    const migrate = require('migrate')
    const migrationStore = require('./src/db/migrationStore')
    migrate.load({
      migrationsDirectory: path.join(__dirname, './migrations'),
      stateStore: new migrationStore()
    }, function (err, set) {
      if (err) {
        throw err
      }
      set.up(function (err) {
        if (err) {
          throw err
        }
        console.log('migrations successfully ran')
      })
    })

  }

}

const server = new Server(config);

if (!module.parent) {
  server.start();
}

module.exports = server;
