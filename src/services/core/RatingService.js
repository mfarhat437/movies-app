const BaseService=require('../BaseService')
const MoviesService=require('./MoviesService')

class RatingService extends BaseService {
    async rateMovie(movieId,data){
      const movie = await MoviesService.getMovieById(movieId)
      const {vote_count, vote_sum, vote_average}= await this.calculateRate(movie.vote_count,movie.vote_sum,data.rate)
      return MoviesService.updateMovie(movieId, {vote_count,vote_average,vote_sum})
    }
    async calculateRate(current_vote_count,current_vote_sum,rate){

      const vote_count= current_vote_count+1
      const vote_sum = current_vote_sum + rate // vote sum is not provided in old movies data, so we need do a migration for them
      const vote_average = Math.ceil((vote_sum/vote_count)*10)/ 10
      return {vote_count, vote_sum, vote_average}

    }
}
module.exports= new RatingService()