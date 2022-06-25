/**
 * Title: Utilities
 * Description: Important utilities for this project
 * Author: MMR Ahmad
 * Data: 23-06-2022
 */

//
const crypto = require('crypto');
const env = require('./environment');

// Module scaffolding
const utilities = {};

/**
 * Expect json string return json object
 * @param {str} string
 * @returns json object
 */
utilities.parseJson = (stringJson) => {
  let parsedJson;

  try {
    parsedJson = JSON.parse(stringJson);
  } catch (error) {
    parsedJson = {};
  }

  return parsedJson;
};

utilities.hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto
      .createHmac('sha256', env.passwordHashSecret)
      .update(str)
      .digest('hex');
    return hash;
  }
  return false;
};

utilities.createRandomString = (strLength) => {
  let length;
  length =
    typeof strLength === 'number' && strLength > 0
      ? strLength
      : false;

  const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
  if (length) {
    let output = '';
    for (let i = 1; i <= length; i++) {
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      output += randomCharacter;
    }
    return output;
  }
  return false;
};

// Export
module.exports = utilities;
