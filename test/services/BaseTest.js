const db = require('../../src/db/index');

class BaseTest {
  constructor() {
    this.test();
    // TODO: fix me
    // eslint-disable-next-line no-underscore-dangle
    this.models = db._registerModels();
  }

  // eslint-disable-next-line class-methods-use-this
   test() {
    throw new Error('should implement this first');
  }
}

module.exports = BaseTest;
