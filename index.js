/**
 * Title: Test Application
 * Description: This is node js test application
 * Author: MMR Ahmad
 * Date: 23-06-2022
 */

// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const env = require('./helpers/environment');
const data = require('./lib/data');

// App object - app scaffolding
const app = {};

data.delete('test', 'testFile', (err) => {
  console.log({ err });
});

// Create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(env.port, () => {
    console.log(
      `your ${
        env.port === 8080 ? 'production' : 'development'
      } application listen in port ${env.port}`
    );
  });
};

// Request and response handler
app.handleReqRes = handleReqRes;

app.createServer();
