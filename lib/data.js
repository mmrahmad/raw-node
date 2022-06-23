/**
 * Title: Data management system
 * Description: Req and res data manage.
 * Author: MMR Ahmad
 * Date: 23-06-2022
 */

// Dependencies
const fs = require('fs');
const path = require('path');

// module scaffolding
const lib = {};

// Base directory of data folder
lib.basedir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
  // open file for writing
  fs.open(
    `${lib.basedir}${dir}/${file}.json`,
    'wx',
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert data to stringify
        const stringData = JSON.stringify(data);

        // write data to file and close it
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback('Error to closing the file!');
              }
            });
          } else {
            callback('Error writing to new file!');
          }
        });
      } else {
        callback('Could not create new file, it my already exists!');
      }
    }
  );
};

// Read data from file
lib.read = (dir, file, callback) => {
  fs.readFile(
    `${lib.basedir}${dir}/${file}.json`,
    'utf-8',
    (err, data) => {
      callback(err, data);
    }
  );
};

// Update existing file
lib.update = (dir, file, data, callback) => {
  // file open to write
  fs.open(
    `${lib.basedir}${dir}/${file}.json`,
    'r+',
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert the data to string
        const stringData = JSON.stringify(data);

        fs.ftruncate(fileDescriptor, (err) => {
          if (!err && fileDescriptor) {
            // Write to the file and close it]\
            fs.writeFile(fileDescriptor, stringData, (err) => {
              if (!err) {
                fs.close(fileDescriptor, (err) => {
                  if (!err) {
                    callback(false);
                  } else {
                    callback('Error in closing file!');
                  }
                });
              } else {
                callback('Error to writing the file!');
              }
            });
          } else {
            callback('Error truncating file!');
          }
        });
      } else {
        callback('Error updating file, may not exist!');
      }
    }
  );
};

// Delete existing file
lib.delete = (dir, file, callback) => {
  // unlink file
  fs.unlink(`${lib.basedir}${dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback('Error deleting file!');
    }
  });
};

// Export
module.exports = lib;
