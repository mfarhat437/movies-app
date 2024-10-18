'use strict'
const MoviesSyncService=require('../src/services/core/MoviesSyncService')
const {Movie}=require('../src/db/models/index')
const ConfigurationService=require('../src/services/core/ConfigurationService')

module.exports.up = async (next)=> {
  await ConfigurationService.initialize()
  const movies=await MoviesSyncService.fetchMovies()
  await Movie.createMany(movies)
  await ConfigurationService.update({last_sync : new Date()})
  next()
}

module.exports.down = async (next)=> {
  next()
}
