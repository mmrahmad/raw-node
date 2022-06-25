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
  checkHandler,
} = require('./handlers/routeHandlers/checkHandler');
const {
  homeHandler,
} = require('./handlers/routeHandlers/homeHandler');
const {
  tokenHandler,
} = require('./handlers/routeHandlers/tokenHandler');
const {
  userHandler,
} = require('./handlers/routeHandlers/userHandler');
// Routes
const routes = {
  home: homeHandler,
  about: aboutHandler,
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};

// Export
module.exports = routes;
