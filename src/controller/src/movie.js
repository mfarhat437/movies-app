const express = require('express');
const router = express.Router({mergeParams: true});
const BaseController = require('../BaseController');
const MoviesService = require('../../services/core/MoviesService')
const {createMovieSchema,updateMovieSchema} = require('../../validations/movie')
const {paginationQuerySchema} = require('../../validations/shared')
const validate = require("../../middlewares/validate");
router.post('/', validate(createMovieSchema), async (req, res, next) => {
    try {
        const result = await MoviesService.create(req.body)
        res.send(result)
    } catch (e) {
        next(e)
    }

});

router.get('/', validate(paginationQuerySchema, "query"), async (req, res, next) => {
    try {
        const result = await MoviesService.listMovies(req.query);
        res.send(result)
    } catch (e) {
        next(e)
    }
});

router.put('/:movieId', validate(updateMovieSchema),validate(), async (req, res, next) => {
    try {
        const result= await MoviesService.updateMovie(req.params.movieId, req.body)
        res.send(result)
    } catch (e) {
        next(e)
    }

});
router.delete('/:movieId', validate(), async (req, res, next) => {
    try {
        const result= await MoviesService.deleteMovie(req.params.movieId)
        res.send(result)
    } catch (e) {
        next(e)
    }

});

module.exports = new BaseController('/movies', 'public', router);
