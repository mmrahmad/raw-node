/**
 * Title: Not Found route handler
 * Description: This is not found route handler
 * Author: MMR Ahmad
 * Date: 23-06-2022
 */

// Module scaffolding
const handler = {};

// Handler
handler.notFoundHandler = (reqProperties, callback) => {
  console.log('This is from not found page');
  callback(404, {
    message: 'Page not found!',
  });
};

// Export
module.exports = handler;
