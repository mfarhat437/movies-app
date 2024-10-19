const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

module.exports = {
  createMovieSchema: Joi.object().keys({
    title: Joi.string().min(3).required(),
    genre_ids:Joi.array().items(Joi.number()).required(),
    overview:Joi.string().min(5),

  }).options({ stripUnknown: true }),
  updateMovieSchema: Joi.object().keys({
    title: Joi.string().min(3),
    genre_ids:Joi.array().items(Joi.number()),
    overview:Joi.string().min(5),

  }).options({ stripUnknown: true }),

};
