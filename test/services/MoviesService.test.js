const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');
const faker = require('faker');
const BaseTest = require('./BaseTest');
chai.use(require('sinon-chai'));
const mongoose = require('mongoose');

class MoviesServiceTest extends BaseTest {
  constructor() {
    super();
    this.MoviesService = require('../../src/services/core/MoviesService');
    this.Movie = require('../../src/db/models/index').Movie;

  }

   test() {
    const movieData = {
      _id: new mongoose.Types.ObjectId(),
       ttile: faker.name 
    };
    describe('MoviesServiceTest', () => {
      let sandbox;
      beforeEach(() => {
        sandbox = sinon.createSandbox();
      });

      afterEach(() => {
        sandbox.restore();
      });
      it('updateMovie should update movie', async () => {
        const getMovieStub = sandbox.stub(this.MoviesService, 'getMovieById').returns(movieData);
        const updateMovieStub = sandbox.stub(this.Movie, 'updateById').returns(movieData);
        await this.MoviesService.updateMovie(movieData._id);
        expect(getMovieStub).to.have.been.calledOnceWith(movieData._id);
        expect(updateMovieStub).to.have.been.calledOnceWith(movieData._id);
      });
    });
  }
}

module.exports = new MoviesServiceTest();
