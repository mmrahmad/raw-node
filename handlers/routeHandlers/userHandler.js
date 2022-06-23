/**
 * Title: User route handler
 * Description: This is user route handler
 * Author: MMR Ahmad
 * Date: 23-06-2022
 */

// Dependencies
const { hash } = require('../../helpers/utilities');
const data = require('../../lib/data');

// Module scaffolding
const handler = {};

// Handler
handler.userHandler = (reqProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(reqProperties.method) > -1) {
    handler._users[reqProperties.method](reqProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

handler._users.get = (reqProperties, callback) => {
  callback(200, {
    data: 'This is data',
  });
};
handler._users.post = (reqProperties, callback) => {
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
  tscAccept =
    typeof reqProperties.body.tscAccept === 'boolean'
      ? reqProperties.body.tscAccept
      : null;

  if (firstName && lastName && mobile && password && tscAccept) {
    data.read('users', mobile, (err, user) => {
      if (err) {
        // TODO: Create user data
        const userData = {
          firstName,
          lastName,
          mobile,
          password: hash(password),
          tscAccept,
        };
        data.create('users', mobile, userData, (err) => {
          if (err) {
            callback(500, {
              error: 'There was an server side error!',
            });
          } else {
            callback(200, {
              message: 'User creating successful!',
            });
          }
        });
      } else {
        callback(500, {
          error: 'User already exist!',
        });
      }
    });
  } else {
    callback(400, {
      error: 'You have a problem in your request!',
    });
  }
};
handler._users.put = (reqProperties, callback) => {};
handler._users.delete = (reqProperties, callback) => {};

// Export
module.exports = handler;
