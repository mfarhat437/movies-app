const BaseService=require('../BaseService')
const MoviesService=require('./MoviesService')

class RatingService extends BaseService {
    async rateMovie(movieId,data){
      const movie = await MoviesService.getMovieById(movieId)
      const vote_count= movie.vote_count+1
      const vote_sum = movie.vote_sum + data.rate // vote sum is not provided in old movies data, so we need do a migration for them
      const vote_average = Math.ceil((vote_sum/vote_count)*10)/ 10
      return MoviesService.updateMovie(movieId, {vote_count,vote_average,vote_sum})
    }
}
module.exports= new RatingService()