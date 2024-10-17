const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const {
  ValidationError, Error: BaseError
} = require('./errors/index');

const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const axios = require('axios')
const {handleAxiosError} = require("./errors/AxiosError");
class Utils {
  static inDevelopment() {
    const env = process.env.NODE_ENV || 'development';
    return (env === 'development');
  }

  static getPath(base, file) {
    return path.join(base, file);
  }

  static dirWalk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
      const fPath = `${dir}/${file}`;
      const stat = fs.statSync(fPath);

      if (stat && stat.isDirectory()) {
        results = results.concat(Utils.dirWalk(fPath));
      } else {
        results.push(fPath);
      }
    });

    return results;
  }


  static parseBoolean(text) {
    if (_.isNil(text) || text.length === 0) {
      return false;
    }

    return (text.toLowerCase() === 'true');
  }


  static toObjectId(id) {
    return new mongoose.Types.ObjectId(id);
  }


  static validateJoiSchema = (schema, data) => {
    const isValid = schema.validate(data);
    if (isValid.error) {
        const errMsg = isValid.error.details[0].message.replace(/"/g, '');
        throw new ValidationError(0, errMsg);
    }
    return isValid.value
}



  static isObjectId(id) {
    const checkForHexRegExp = /^[0-9a-fA-F]{24}$/g;
    return checkForHexRegExp.test(id);
  }
  static async sendGetRequestToService(url) {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        url: url,
      };
      const result = await axios(options)
      return result.data
    } catch (err) {
      throw handleAxiosError(err);
    }
  }
  static async sendPostRequestToService(url, data={}) {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: data,
        url: url,
      };
      const result = await axios(options)
      return result.data
    } catch (err) {
      throw handleAxiosError(err);
    }
  }

}

module.exports = Utils;
