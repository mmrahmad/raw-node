/**
 * Title: Application handler
 * Description: This is application handler to handle req-res
 * Author: MMR Ahmad
 * Data: 23-06-2022
 */

// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const {
  notFoundHandler,
} = require('../handlers/routeHandlers/notFoundHandler');
const { parseJson } = require('./utilities');

// Module scaffolding
const handler = {};

// handlers
handler.handleReqRes = (req, res) => {
  // handle the request
  // get the url and parse it
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const queryObject = parsedUrl.query;
  const headersObject = req.headers;

  const reqProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryObject,
    headersObject,
  };

  //   Decoder
  const decoder = new StringDecoder('utf-8');
  let realString = '';
  //   Listen buffer data
  req.on('data', (buffer) => {
    realString += decoder.write(buffer);
  });
  req.on('end', () => {
    realString += decoder.end();
    // convert realString to json object &
    // include req body in reqProperties
    reqProperties.body = parseJson(realString);

    // chosenHandler
    const chosenHandler = routes[trimmedPath]
      ? routes[trimmedPath]
      : notFoundHandler;
    chosenHandler(reqProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === 'number' ? statusCode : 500;
      payload = typeof payload === 'object' ? payload : {};

      const payloadString = JSON.stringify(payload);

      // return final response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

module.exports = handler;
