const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

let lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

//Creat data file
lib.create = (dir, file, data, callback) => {
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            //Conv data to string
            let stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    })
                } else {
                    callback('Error on new file');

                }
            });
        } else {
            callback('Could not creat file it may exist');
        }
    });
}

//Read data file
lib.read = (dir, file, callback) => {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', (err, data) => {
        if (!err && data) {
            var parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        } else {
            callback(err, data);
        }
    });
};

//Update data in a file
lib.update = (dir, file, data, callback) => {

    // Open the file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert data to string
            var stringData = JSON.stringify(data);

            // Truncate the file
            fs.truncate(fileDescriptor, (err) => {
                if (!err) {
                    // Write to file and close it
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, function (err) {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('Error closing existing file');
                                }
                            });
                        } else {
                            callback('Error writing to existing file');
                        }
                    });
                } else {
                    callback('Error truncating file');
                }
            });
        } else {
            callback('Could not open file for updating, it may not exist yet');
        }
    });

};

// Delete a file
lib.delete = function (dir, file, callback) {

    // Unlink the file from the filesystem
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
        callback(err);
    });

};

// List all the items in a directory
lib.list =  (dir, callback)  => {
    fs.readdir(lib.baseDir + dir + '/',  (err, data) => {
        if (!err && data && data.length > 0) {
            var trimmedFileNames = [];
            data.forEach(function (fileName) {
                trimmedFileNames.push(fileName.replace('.json', ''));
            });
            callback(false, trimmedFileNames);
        } else {
            callback(err, data);
        }
    });
};

lib.rename = ( dir ,oldDir, newDir, callback) => {

    fs.rename(lib.baseDir + dir + '/' + oldDir + '.json',
            lib.baseDir + dir + '/' + newDir + '.json', (err) => {

            if (err) {
                callback(err);
            }
            callback('File Renamed.');
        });

}

module.exports = lib;