const express = require('express');
const router = express.Router({mergeParams: true});
const BaseController = require('../BaseController');
const RatingService = require('../../services/core/RatingService')
const {rateMovie} = require('../../validations/rate')
const validate = require("../../middlewares/validate");
router.post('/:movieId/rates', validate(rateMovie), async (req, res, next) => {
    try {
        const result = await RatingService.rateMovie(req.params.movieId, req.body)
        res.send(result)
    } catch (e) {
        next(e)
    }

});

module.exports = new BaseController('/movies', 'public', router);
