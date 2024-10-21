const config = require('../../config/config');
const BaseService=require('../BaseService')
const axios = require('axios');
const {PATHS}=require('../../config/constants/paths')
const ConfigurationService=require('./ConfigurationService')
const {Movie}=require('../../db/models/index')
class SyncService extends BaseService {
    constructor(){
        super()
        this.apiKey=config.TMDB_config.apiKey
        this.connector= axios.create({
            baseURL: PATHS.SYNC_SERVICE_BASE_URL,
            params: {
              api_key: this.apiKey
            }
          });
    }
    async fetchMovies (filters)  {
      let query=``
      if(filters && filters.last_sync)
          query+=`?primary_release_date.gte=${filters.last_sync.toISOString().split('T')[0]}`
      const response = await this.connector.get(`${PATHS.GET_POPULAR_MOVIES_ENDPOINT}${query}`);
      return response.data.results;
    };
    
    async syncMovies(){
      const {last_sync}= await ConfigurationService.get()
      const movies= await this.fetchMovies({last_sync})
      const now = new Date()
      for (let movie of movies) {
          await Movie.updateOne(
            { id: movie.id }, // Match the movie by TMDB ID
            {
              id:movie.id,
              title: movie.title,
              genre_ids: movie.genre_ids,
              overview:movie.overview,
              releaseDate: movie.release_date,
              vote_average: movie.vote_average,
              vote_count:movie.vote_count,
              updated_at: now // Update the sync timestamp for each movie
            },
            { upsert: true } // Create a new document if no match is found
          );
        }
      await ConfigurationService.update({last_sync:now})  
      return {message:"Sync Done Successfully"}  
    } 
}
module.exports= new SyncService()