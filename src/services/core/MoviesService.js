const BaseService=require('../BaseService')
const {Movie}=require('../../db/models/index')
class MoviesService extends BaseService {
     async listMovies ( filters, pagination= false)  {
        const query={}
        const params={sort:{created_at:-1}}
        let paginate = pagination
        if (filters.pagination) 
          paginate = this.utils.parseBoolean(filters.pagination);
        if(filters.genre) // TODO check genreId in TMDB
          query['genre_ids']={$in:[parseInt(filters.genre)]}
        return Movie.getAll(query, params, paginate);
      };
    async create(data){
      return Movie.create(data)
    }
    async updateMovie(movieId,data){
      await this.getMovieById(movieId)
      return Movie.updateById(movieId,data,{new:true})
    }
    async getMovieById(movieId){
      const movie=await Movie.getById(movieId)
      if(!movie)
        throw new this.NotFoundError(0,`Movie doesn't exist`)
      return movie
    }
    async deleteMovie(movieId){
      await Movie.getById(movieId)
      await Movie.deletById(movieId)
      return {message:"Movie deleted successfully"}
    }

}
module.exports= new MoviesService()