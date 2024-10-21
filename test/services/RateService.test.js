const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');
const faker = require('faker');
const BaseTest = require('./BaseTest');
chai.use(require('sinon-chai'));
const mongoose = require('mongoose');

class RateServiceTest extends BaseTest {
  constructor() {
    super();
    this.RatingService = require('../../src/services/core/RatingService');
    this.MoviesService = require('../../src/services/core/MoviesService');
    this.Movie = require('../../src/db/models/index').Movie;

  }

   test() {
    const movieData = {
      _id: new mongoose.Types.ObjectId(),
       ttile: faker.name,
       vote_count: 10,
       vote_sum: 40,
 
    };
    describe('RatingService', () => {
      let sandbox;
      beforeEach(() => {
        sandbox = sinon.createSandbox();
      });

      afterEach(() => {
        sandbox.restore();
      });
      it('rateMovie should rate a movie', async () => {
        const getMovieStub = sandbox.stub(this.MoviesService, 'getMovieById').returns(movieData);
        const calculateRateStub = sandbox.stub(this.RatingService, 'calculateRate').returns({
          vote_count: 11,
          vote_sum: 45,
          vote_average: 4.09,
        });
        const updateMovieStub = sandbox.stub(this.MoviesService, 'updateMovie').returns({ vote_count: 11, vote_average: 4.09, vote_sum: 45 });
        const result= await this.RatingService.rateMovie(movieData._id,{rate:5});
        expect(getMovieStub).to.have.been.calledOnceWith(movieData._id);
        expect(updateMovieStub).to.have.been.calledOnceWith(movieData._id);
        expect(calculateRateStub.calledOnceWith(10, 40, 5)).to.be.true;
        expect(result).to.deep.equal({ vote_count: 11, vote_average: 4.09, vote_sum: 45 });

      });
      it('calculateRate should calculate the rate', async () => {
        const current_vote_count = 2;
        const current_vote_sum = 8;
        const rate = 4;
        const result= await this.RatingService.calculateRate(current_vote_count, current_vote_sum, rate);
        expect(result.vote_count).to.equal(3);
        expect(result.vote_sum).to.equal(12);
        expect(result.vote_average).to.equal(4); 
    
      });

    });
  }
}

module.exports = new RateServiceTest();
