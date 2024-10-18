const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { accessibleRecordsPlugin } = require('@casl/mongoose');
mongoose.plugin(accessibleRecordsPlugin);
const DB_RETRIES = 30;
const DB_WAIT_TIME = 2000;
class Database {
  constructor() {
    this._initialized = false;
    this._connection = undefined;
    this._retries = 0;
  }

  /**
   * Register all models in ./models directory
   * Note: Does not work recursively
   * @private
   */

  async _registerPlugins() {
    await new Promise((resolve, reject) => {
      const pluginsDir = 'plugins';
      const dir = path.join(__dirname, pluginsDir);
      fs.readdir(dir, (err, files) => {
        if (err) {
          reject(err);
          return;
        }

        for (let i = 0; i < files.length; i += 1) {
          const plugin = require(path.join(dir, files[i])); // eslint-disable-line global-require
          mongoose.plugin(plugin);
        }

        resolve();
      });
    });
  }

  // TODO: this requires need to be refactored
  async _registerModels() {
    require('./models/migration')
    require('./models/movies')
    require('./models/Configuration')

  }

  // eslint-disable-next-line max-lines-per-function
  async _connect(uri, options) {
    try {
      await new Promise((resolve, reject) => {
        mongoose.connect(uri, options).then(
          () => resolve(),
          (err) => reject(err),
        );
      });
      // Only apply index & configurations first time
      const collections = await this.getCollections();
      if (collections && collections.length === 0) {
        await this.ensureIndexes();
      }
    } catch (err) {
      if (this._retries >= DB_RETRIES) {
        throw err;
      }

      this._retries += 1;
      // TODO: use reject here to handle errors
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`Waiting for database, Reason: ${err.message}`);
          resolve(this._connect(uri, options));
        }, DB_WAIT_TIME);
      });
    }
  }

  async initialize(dbConfig) {
    if (this._initialized) {
      return;
    }
    await this._registerPlugins();// Register plugins
    await this._registerModels(); // Register models
    // Connect to mongodb
    this._config = dbConfig;
    const uri = dbConfig.url;
    const options = {
      autoIndex: false, // Don't build indexes "Production"
      useNewUrlParser: true,
      socketTimeoutMS: 30000,
      // keepAlive: true,
    };
    await this._connect(uri, options);
    this._initialized = true;
    this._connection = mongoose.connection;
  }

  get isInitialized() {
    return this._initialized;
  }

  get connection() {
    return this._connection;
  }

  async close() {
    return new Promise((resolve) => {
      this._connection.close(() => {
        resolve();
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async getCollections() {
    try {
      const { connections } = mongoose;
      if (connections && connections.length > 0) {
        const { db } = connections[0];
        const collections = await db.listCollections().toArray();
        // const session= db.startSession()
        //  session.startTransaction()
        return collections;
      }

      return undefined;
    } catch (err) {
      return undefined;
    }
  }

  async ensureIndexes() {
    const { models } = mongoose;
    const promises = [];
    // models.forEach((model) => {
    //   promises.push(models[model].createIndexes());
    // });

    await Promise.all(promises);
  }
}

module.exports = new Database();
