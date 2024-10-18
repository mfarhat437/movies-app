const config = require('../../config/config');
const BaseService=require('../BaseService')
const axios = require('axios');
const {PATHS}=require('../../config/constants/paths')
class MoviesSyncService extends BaseService {
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
     async fetchMovies ()  {
        const response = await this.connector.get(PATHS.GET_POPULAR_MOVIES_ENDPOINT);
        return response.data.results;
      };
      

}
module.exports= new MoviesSyncService()