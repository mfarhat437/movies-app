/* eslint-disable max-len */

const _ = require('lodash');

/**
 * params:
 * page: number
 * limit: number
 * fields: comma separated values for data you want to be returned
 * lean: [false] boolean to indicate that you need only data or full mongoose object
 * sort: comma separated values, with/without minus operator Ex. sort=-table,followers
 * populate: array of arrays, which contains populate field and selection Ex. [['employees', '_id name'], ['address']]
 *           or array of mongoose populate objects objects
 *           {
 *               path: 'fans',
 *               match: { age: { $gte: 21 }},
 *               // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
 *               select: 'name -_id',
 *               options: { limit: 5 }
 *           }
 *  Note:
 *  We can send additional params from controller to service under fields _options
 *  for security this will be removed from query mutation so its only send internally by devs
 */
class BaseModel {
  constructor(model) {
    this.model = model;
  }

  // eslint-disable-next-line class-methods-use-this
  _buildQuery(func, params) {
    if (_.isNil(params)) {
      return func;
    }

    const { fields, populate, lean } = params;
    if (!_.isNil(fields)) func.select(fields);
    if (!_.isNil(lean)) func.lean();

    // Add populate
    if (populate) {
      for (let i = 0; i < populate.length; i += 1) {
        if (_.isArray(populate[i])) {
          func.populate(...populate[i]);
        } else {
          func.populate(populate[i]);
        }
      }
    }

    return func;
  }

  async getDocumentsCount() {
    return this.model.countDocuments();
  }

  async getCount(query, options) {
    return this.model.countDocuments(query, options).exec();
  }

  async exists(query) {
    const exists = await this.model.findOne(query)
      .lean()
      .exec();
    return !_.isNil(exists);
  }

  async create(data) {
    const document = new this.model.prototype.constructor(data);
    return document.save();
  }

  async update(query, data, options, params) {
    const queryBuilder = this._buildQuery(this.model.updateOne(query, data, options), params);
    return queryBuilder.exec();
  }

  async updateMany(query, data, options, params) {
    const queryBuilder = this._buildQuery(this.model.updateMany(query, data, options), params);
    return queryBuilder.exec();
  }

  async findAndModify(query, data, options, params) {
    const queryBuilder = this._buildQuery(this.model.findOneAndUpdate(query, data, options), params);
    return queryBuilder.exec();
  }

  async updateOne(query, data, options, params) {
    const queryBuilder = this._buildQuery(this.model.findOneAndUpdate(query, data, options), params);
    return queryBuilder.exec();
  }

  async updateById(id, data, options, params) {
    const queryBuilder = this._buildQuery(this.model.findByIdAndUpdate(id, data, options), params);
    return queryBuilder.exec();
  }
  async createMany( data, options, params) {
    const queryBuilder = this._buildQuery(this.model.insertMany( data, options), params);
    return 
  }

  // eslint-disable-next-line max-lines-per-function
  async getAll(query, params = {}, paginate = true) {
    const { page, limit, sort } = params;
    const queryBuilder = this._buildQuery(this.model.find(query || {}), params);
    if (paginate) {
      const pageCount = parseInt(page) - 1;
      queryBuilder.skip((parseInt(limit) * parseInt(pageCount)));
      queryBuilder.limit(parseInt(limit));
    }
    if (sort)
      queryBuilder.sort(sort);
    let result = await queryBuilder.exec();
    if (paginate) {
      let count;
      if (_.isEmpty(query)) {
        count = await this.getDocumentsCount();
      } else {
        count = await this.getCount(query || {});
      }
      const pagesCount = Math.ceil(count / limit) || 1;
      result = {
        [this.model.collection.name]: result,
        page: parseInt(page),
        pages: pagesCount,
        length: count,
      };
    }
    return result;
  }
  // eslint-disable-next-line max-lines-per-function
  async aggregate(query, params = {}, paginate = true) {
    let { page, limit } = params;
    let pagesCount;
    let count;
    if (paginate) {
      query.push({ $count: 'length' });
      count = await this.model.aggregate(query);
      if (count.length > 0) {
        count = count[0].length;
      }
      query.pop();
      if (!limit) { limit = count; }
      pagesCount = Math.ceil(count / limit) || 1;
      query.push({
        $facet: {
          [this.model.collection.name]: [{ $skip: parseInt(limit || 0) * parseInt(page ? (parseInt(page) - 1) : 0) }, { $limit: parseInt(limit || 0) }],
        },
      });
    }
    const queryBuilder = this.model.aggregate(query);
    let result = await queryBuilder.exec();
    if (paginate) {
      result = {
        [this.model.collection.name]: result[0][this.model.collection.name],
        page: parseInt(page || 0),
        pages: pagesCount,
        length: count,
      };
    }
    return result;
  }

  async getOne(query, params) {
    const queryBuilder = this._buildQuery(this.model.findOne(query || {}), params);
    return queryBuilder.exec();
  }

  async getById(id, params) {
    const queryBuilder = this._buildQuery(this.model.findById(id), params);
    return queryBuilder.exec();
  }

  async delete(query) {
    const queryBuilder = this.model.findOneAndRemove(query);
    return queryBuilder.exec();
  }

  async deleteById(id) {
    const queryBuilder = this.model.findByIdAndDelete(id);
    return queryBuilder.exec();
  }

  async deleteAll(query) {
    const queryBuilder = this.model.remove(query);
    return queryBuilder.exec();
  }
}

module.exports = BaseModel;
