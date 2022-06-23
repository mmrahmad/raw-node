/**
 * Title: Home route handler
 * Description: This is home route handler
 * Author: MMR Ahmad
 * Date: 23-06-2022
 */

// Module scaffolding
const handler = {};

// Handler
handler.homeHandler = (reqProperties, callback) => {
  console.log('This is from home page');
  callback(200, {
    hello: 'from home page!',
  });
};

// Export
module.exports = handler;
