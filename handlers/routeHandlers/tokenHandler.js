/**
 * Title: Token route handler
 * Description: This is token route handler
 * Author: MMR Ahmad
 * Date: 25-06-2022
 */

// Dependencies
const {
  hash,
  parseJson,
  createRandomString,
} = require('../../helpers/utilities');
const data = require('../../lib/data');

// Module scaffolding
const handler = {};

// Handler
handler.tokenHandler = (reqProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(reqProperties.method) > -1) {
    handler._token[reqProperties.method](reqProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

/**
 * POST method
 * @param {Object} reqProperties
 * @param {Function} callback
 */
handler._token.post = (reqProperties, callback) => {
  password =
    typeof reqProperties.body.password === 'string' &&
    reqProperties.body.password.trim().length > 0
      ? reqProperties.body.password
      : null;
  mobile =
    typeof reqProperties.body.mobile === 'string' &&
    reqProperties.body.mobile.trim().length === 11
      ? reqProperties.body.mobile
      : null;
  if (password && mobile) {
    data.read('users', mobile, (err, userData) => {
      const userInfo = parseJson(userData);
      let hashedPassword = hash(password);
      if (hashedPassword === userInfo.password) {
        let tokenId = createRandomString(16);
        let expire = Date.now() + 60 * 60 * 1000;
        let tokenObject = {
          mobile,
          id: tokenId,
          expire,
        };
        data.create('tokens', tokenId, tokenObject, (err) => {
          if (!err) {
            callback(200, {
              data: tokenObject,
            });
          } else {
            callback(500, {
              error: 'There was an error in server side!',
            });
          }
        });
      } else {
        callback(400, {
          error: 'Password is not valid!',
        });
      }
    });
  } else {
    callback(400, {
      error: 'There is an problem in your request!',
    });
  }
};

/**
 * GET method
 * @param {Object} reqProperties
 * @param {Function} callback
 */
handler._token.get = (reqProperties, callback) => {
  // validation
  const id =
    typeof reqProperties.queryObject.id === 'string' &&
    reqProperties.queryObject.id.trim().length > 0
      ? reqProperties.queryObject.id
      : false;

  if (id) {
    data.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        const data = { ...parseJson(tokenData) };
        callback(200, {
          data: data,
        });
      } else {
        callback(404, {
          error: 'Token not found!',
        });
      }
    });
  } else {
    callback(404, {
      error: 'Please sent a token id as a query!',
    });
  }
};

/**
 * PUT method
 * @param {Object} reqProperties
 * @param {Function} callback
 */
handler._token.put = (reqProperties, callback) => {
  id =
    typeof reqProperties.body.id === 'string' &&
    reqProperties.body.id.trim().length === 16
      ? reqProperties.body.id
      : null;
  extend =
    typeof reqProperties.body.extend === 'boolean' &&
    reqProperties.body.extend === true
      ? reqProperties.body.extend
      : null;
  if (id && extend) {
    data.read('tokens', id, (err, tokenData) => {
      const token = { ...parseJson(tokenData) };
      if (token.expire > Date.now()) {
        const copyData = {
          ...token,
          expire: token.expire + Date.now() + 60 * 60 * 1000,
        };
        data.update('tokens', id, copyData, (err) => {
          if (!err) {
            callback(200, {
              message: 'Token updated successfully!',
            });
          } else {
            callback(500, {
              error: 'There was an server side error!',
            });
          }
        });
      } else {
        callback(400, {
          error: 'Token already expired!',
        });
      }
    });
  } else {
    callback(400, {
      error: 'There was an error in you request!',
    });
  }
};

/**
 * DELETE method
 * @param {Object} reqProperties
 * @param {Function} callback
 */
handler._token.delete = (reqProperties, callback) => {
  // validation
  const id =
    typeof reqProperties.queryObject.id === 'string' &&
    reqProperties.queryObject.id.trim().length > 0
      ? reqProperties.queryObject.id
      : false;

  if (id) {
    data.delete('tokens', id, (err) => {
      if (!err) {
        callback(200, {
          message: 'Token delete successfully!',
        });
      } else {
        callback(500, {
          error: 'There was an server side error!',
        });
      }
    });
  } else {
    callback(404, {
      error: 'Please sent a token id as a query!',
    });
  }
};

handler._token.verify = (id, mobile, callback) => {
  data.read('tokens', id, (err, tokenData) => {
    if (!err && tokenData) {
      if (
        parseJson(tokenData).mobile === mobile &&
        parseJson(tokenData).expire > Date.now()
      ) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

// Export
module.exports = handler;
