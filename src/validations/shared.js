const { invalid } = require('joi');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

module.exports = {
  paginationQuerySchema: Joi.object().keys({
    pagination: Joi.string().valid('true', 'false'),
    limit: Joi.number().min(1),
    page: Joi.number().min(1),
    genre: Joi.number().min(1),

  }).options({ stripUnknown: true }),
  dateFilterQuerySchema: Joi.object().keys({
    start_date: Joi.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/),
    end_date: Joi.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/),

  }).options({ stripUnknown: true }),
  objectIdVaidation:Joi.objectId().error(errors => {
    errors.forEach(err => {
      err.message="invalid id"
    })
    return errors
  }),

};
