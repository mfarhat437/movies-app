
const Migration= require('../ModelsFactory').create('Migration')
const Movie= require('../ModelsFactory').create('Movie')
const Configuration= require('../ModelsFactory').create('Configuration')

module.exports = {
  Migration,
  Movie,
  Configuration
};
