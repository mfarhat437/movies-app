const bcrypt = require('bcrypt-nodejs');
const uniqid = require('uniqid');
const jwt = require('jsonwebtoken');

const config = require('../config/config.js');

class Utils {
  static createHash(text) {
    const salt = bcrypt.genSaltSync(5);
    return bcrypt.hashSync(text, salt);
  }

  static compareHash(text, hash) {
    return bcrypt.compareSync(text, hash);
  }

  static generateJwtToken(data) {
    const accessTokenExpiration = config.auth.local.tokenLife
    const options = {
      expiresIn: accessTokenExpiration
    }
    const token = jwt.sign(data, config.auth.local.key, options);
    return token;
  }
  static generateRefreshJwtToken(data) {
    const refreshtokenExpiration = config.auth.local.refreshTokenLife
    const options = {
      expiresIn: refreshtokenExpiration
    }
    const token = jwt.sign(data, config.auth.local.refresh_token_key, options);
    return token;
  }

  static generateUniqueId() {
    return uniqid();
  }

  static generateRandomNumber() {
    const number = Math.floor(Math.random() * 9000) + 1000;
    return number;
  }

  static generateJWTBasedOnTime(signObj, timeoutMs) {
    const expiry = new Date();
    const timeoutSeconds = parseInt(timeoutMs / 1000);
    // TODO:fix me
    // eslint-disable-next-line no-param-reassign
    signObj.exp = parseInt(expiry.getTime() / 1000) + timeoutSeconds;
    const token = jwt.sign(signObj, config.auth.local.key);
    return token;
  }

  static async decodeJWT(token) {
    if (token) {
      return this.verifyToken(token);
    }
    return false;
  }

  static verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.auth.local.key, (err, decoded) => {
        if (!err) {
          return resolve(decoded);
        }
        if (err.name === 'TokenExpiredError') {
          // TODO: fix me
          // eslint-disable-next-line no-param-reassign
          err.message = 'Token has been expired...';
        } else if (err.name === 'JsonWebTokenError') {
          // TODO: fix me
          // eslint-disable-next-line no-param-reassign
          err.message = 'Invalid Token....';
        }
        return reject(err);
      });
    });
  }
}

module.exports = Utils;
