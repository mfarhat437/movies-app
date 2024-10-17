const ObjectId = require('mongoose').Types.ObjectId;
const {ValidationError} = require('../helpers/errors')
const {paginationQuerySchema} = require("../validations/shared");
const {validateJoiSchema} = require('../helpers/utils');

const validate = (schema = null, target = "body") => {
    return (req, res, next) => {
        const {body, params, query} = req;
        // Validate Body
        if (schema !== null && typeof schema.validate === "function") {
            if (target === 'query')
                req.query = validateJoiSchema(schema, query);
            else
                req.body = validateJoiSchema(schema, body);
        }
        // Check for invalid ids in params
        for (const key in params) {
            if (!ObjectId.isValid(params[key])) throw new ValidationError(0, `Invalid Parameter ${key}`)
        }
        // Check Pagination variables
        if (query.pagination === 'true') {
            validateJoiSchema(paginationQuerySchema, query);
        }
        next();
    }
}

module.exports = validate