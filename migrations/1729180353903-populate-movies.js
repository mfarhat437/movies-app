'use strict'
const MoviesSyncService=require('../src/services/core/MoviesSyncService')
const {Movie}=require('../src/db/models/index')
module.exports.up = async (next)=> {
  const movies=await MoviesSyncService.fetchMovies()
  await Movie.createMany(movies)
  next()
}

module.exports.down = async (next)=> {
  next()
}
