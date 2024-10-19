const Joi = require('joi');

module.exports = {
  rateMovie: Joi.object().keys({
    rate: Joi.number().min(1).max(10).required(),
    message: Joi.string().min(3).max(500),

  }).options({ stripUnknown: true }),
};
