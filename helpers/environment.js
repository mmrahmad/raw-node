/**
 * Title: Environments Properties
 * Details: Application environment properties
 * Author: MMR Ahmad
 * Date: 23-06-2022
 */

// Dependencies

// Module Scaffolding
const environment = {};

environment.development = {
  port: 3000,
  envName: 'development',
};

environment.production = {
  port: 8080,
  envName: 'production',
};

// Determine which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === 'string'
    ? process.env.NODE_ENV
    : 'development';

// export corresponding environment object
const environmentToExport =
  typeof environment[currentEnvironment] === 'object'
    ? environment[currentEnvironment]
    : environment.development;

// Export
module.exports = environmentToExport;
