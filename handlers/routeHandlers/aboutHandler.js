/**
 * Title: About route handler
 * Description: This is about route handler
 * Author: MMR Ahmad
 * Date: 23-06-2022
 */

// Module scaffolding
const handler = {};

// Handler
handler.aboutHandler = (reqProperties, callback) => {
  console.log('This is from about page');
  callback(200, {
    about: 'This is from about page.',
  });
};

// Export
module.exports = handler;
