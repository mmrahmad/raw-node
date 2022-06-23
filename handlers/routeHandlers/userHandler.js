/**
 * Title: User route handler
 * Description: This is user route handler
 * Author: MMR Ahmad
 * Date: 23-06-2022
 */

// Dependencies
const { hash, parseJson } = require('../../helpers/utilities');
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
  queryMobile = reqProperties.queryObject?.mobile;
  mobile =
    typeof queryMobile === 'string' &&
    queryMobile.trim().length === 11
      ? queryMobile
      : null;
  if (mobile) {
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
    callback(404, {
      message: 'Query mobile not found!',
    });
  }
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
  email =
    typeof reqProperties.body.email === 'string' &&
    reqProperties.body.email.trim().length > 0
      ? reqProperties.body.email
      : null;
  tscAccept =
    typeof reqProperties.body.tscAccept === 'boolean'
      ? reqProperties.body.tscAccept
      : null;

  if (
    firstName &&
    lastName &&
    mobile &&
    password &&
    email &&
    tscAccept
  ) {
    data.read('users', mobile, (err, user) => {
      if (err) {
        const userData = {
          firstName,
          lastName,
          email,
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
      error: 'There is an problem in your request!',
    });
  }
};
handler._users.put = (reqProperties, callback) => {
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
};
handler._users.delete = (reqProperties, callback) => {
  queryMobile = reqProperties.queryObject?.mobile;
  mobile =
    typeof queryMobile === 'string' &&
    queryMobile.trim().length === 11
      ? queryMobile
      : null;
  if (mobile) {
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
    callback(404, {
      message: 'Query mobile not found!',
    });
  }
};

// Export
module.exports = handler;
