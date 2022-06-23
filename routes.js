/**
 * Title: Routes of application
 * Description: All routes describe here for this application
 * Author: MMR Ahmad
 * Date: 23-06-2022
 */
// Dependencies
const {
  aboutHandler,
} = require('./handlers/routeHandlers/aboutHandler');
const {
  homeHandler,
} = require('./handlers/routeHandlers/homeHandler');
// Routes
const routes = {
  home: homeHandler,
  about: aboutHandler,
};

// Export
module.exports = routes;
