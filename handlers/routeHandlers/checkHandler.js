/**
 * Title: Check route handler
 * Description: This is check route handler
 * Author: MMR Ahmad
 * Date: 25-06-2022
 */

// Dependencies
const { hash, parseJson } = require('../../helpers/utilities');
const data = require('../../lib/data');
const tokenHandler = require('./tokenHandler');

// Module scaffolding
const handler = {};

// Handler
handler.checkHandler = (reqProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(reqProperties.method) > -1) {
    handler._check[reqProperties.method](reqProperties, callback);
  } else {
    callback(405);
  }
};

handler._check = {};

/**
 * GET method
 * @param {Object} reqProperties
 * @param {Function} callback
 */
handler._check.get = (reqProperties, callback) => {
  queryMobile = reqProperties.queryObject?.mobile;
  mobile =
    typeof queryMobile === 'string' &&
    queryMobile.trim().length === 11
      ? queryMobile
      : null;
  if (mobile) {
    // verify token
    const token =
      typeof reqProperties.headersObject.token === 'string'
        ? reqProperties.headersObject.token
        : false;

    tokenHandler._token.verify(token, mobile, (validate) => {
      if (validate) {
        data.read('users', mobile, (err, user) => {
          const userCopy = { ...parseJson(user) };
          if (!err && userCopy) {
            delete userCopy.password;
            callback(200, userCopy);
          } else {
            callback(404, {
              error: 'Requested user not found!',
            });
          }
        });
      } else {
        callback(403, {
          error: 'User un-authenticated!',
        });
      }
    });
  } else {
    callback(404, {
      message: 'Query mobile not found!',
    });
  }
};

/**
 * POST method
 * @param {Object} reqProperties
 * @param {Function} callback
 */
handler._check.post = (reqProperties, callback) => {
  // REQ body validation
  let protocol =
    typeof reqProperties.body.protocol === 'string' &&
    ['http', 'https'].indexOf(reqProperties.body.protocol) > -1
      ? reqProperties.body.protocol
      : false;

  let url =
    typeof reqProperties.body.url === 'string' &&
    reqProperties.body.url.trim().length() > 0
      ? reqProperties.body.url
      : false;

  let methods =
    typeof reqProperties.body.methods === 'object' &&
    ['get', 'post', 'put', 'delete'].indexOf(
      reqProperties.body.methods
    ) > -1
      ? reqProperties.body.methods
      : false;

  let successCode =
    typeof reqProperties.body.successCode === 'object' &&
    reqProperties.body.successCode instanceof Array
      ? reqProperties.body.successCode
      : false;

  let timeOutSecond =
    typeof reqProperties.body.timeOutSecond === 'number' &&
    reqProperties.body.timeOutSecond % 1 === 0 &&
    reqProperties.body.timeOutSecond >= 1 &&
    reqProperties.body.timeOutSecond <= 5
      ? reqProperties.body.timeOutSecond
      : false;

  if (protocol && url && methods && successCode && timeOutSecond) {
    const token =
      typeof reqProperties.headersObject.token === 'string'
        ? reqProperties.headersObject.token
        : false;
    data.read('tokens', token, (err, tokenData) => {
      if (!err && tokenData) {
        const tokenDataObject = { ...parseJson(tokenData) };
        const mobile = tokenDataObject.mobile;
        if (mobile) {
          tokenHandler._token.verify(
            token,
            mobile,
            (verification) => {
              if (verification) {
                const checkDataObject = {
                  protocol,
                  url,
                  methods,
                  successCode,
                  timeOutSecond,
                };
                data.create('checks', '', checkDataObject, (err) => {
                  if (!err) {
                  } else {
                  }
                });
              } else {
                callback(403, {
                  error: 'Authentication error!',
                });
              }
            }
          );
        } else {
        }
      } else {
        callback(403, {
          error: 'Authentication error!',
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
 * PUT method
 * @param {Object} reqProperties
 * @param {Function} callback
 */
handler._check.put = (reqProperties, callback) => {
  // REQ body validation
  firstName =
    typeof reqProperties.body.firstName === 'string' &&
    reqProperties.body.firstName.trim().length > 0
      ? reqProperties.body.firstName
      : null;
  lastName =
    typeof reqProperties.body.lastName === 'string' &&
    reqProperties.body.lastName.trim().length > 0
      ? reqProperties.body.lastName
      : null;
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
  email =
    typeof reqProperties.body.email === 'string' &&
    reqProperties.body.email.trim().length > 0
      ? reqProperties.body.email
      : null;
  const token =
    typeof reqProperties.headersObject.token === 'string'
      ? reqProperties.headersObject.token
      : false;

  tokenHandler._token.verify(token, mobile, (validate) => {
    if (validate) {
      if (firstName || lastName || password || email) {
        data.read('users', mobile, (err, userData) => {
          const userCopy = { ...parseJson(userData) };
          if (!err && userCopy) {
            if ('firstName') {
              userCopy.firstName = firstName;
            }
            if ('lastName') {
              userCopy.lastName = lastName;
            }
            if ('email') {
              userCopy.email = email;
            }
            if ('password') {
              userCopy.password = hash(password);
            }
            data.update('users', mobile, userCopy, (err) => {
              if (err) {
                callback(500, {
                  error: 'There was an server side error!',
                });
              } else {
                callback(200, {
                  message: 'User update successful!',
                });
              }
            });
          } else {
            callback(500, {
              error: 'User not exist!',
            });
          }
        });
      } else {
        callback(400, {
          error: 'There is an problem in your request!',
        });
      }
    } else {
      callback(403, {
        error: 'User un-authenticated!',
      });
    }
  });
};

/**
 * DELETE method
 * @param {Object} reqProperties
 * @param {Function} callback
 */
handler._check.delete = (reqProperties, callback) => {
  queryMobile = reqProperties.queryObject?.mobile;
  mobile =
    typeof queryMobile === 'string' &&
    queryMobile.trim().length === 11
      ? queryMobile
      : null;
  if (mobile) {
    const token =
      typeof reqProperties.headersObject.token === 'string'
        ? reqProperties.headersObject.token
        : false;

    tokenHandler._token.verify(token, mobile, (validate) => {
      if (validate) {
        data.delete('users', mobile, (err) => {
          if (!err) {
            callback(200, {
              message: 'User delete successful!',
            });
          } else {
            callback(404, {
              error: 'Requested user not found!',
            });
          }
        });
      } else {
        callback(403, {
          error: 'User un-authenticated!',
        });
      }
    });
  } else {
    callback(404, {
      message: 'Query mobile not found!',
    });
  }
};

// Export
module.exports = handler;
