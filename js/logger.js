'use strict';

var colors = require('colors');
var fs = require('fs');
var logPath = process.env.COLOR_LOG_PATH || null;

module.exports = function (message, fileName, isError, skipLine) {
    var logMessage = new Date().toString() + ' ';

    if (fileName) {
        var fileParts = fileName.split('/');
        logMessage += fileParts.pop() + ' :: ';
    }

    if (isError) {
        logMessage += 'ERROR: ';
    }

    logMessage += message;

    if (skipLine) {
        logMessage += '\n';
    }

    if (isError) {
        console.log(logMessage.red);
    } else {
        console.log(logMessage.yellow);
    }

    if (logPath) {
        fs.appendFile(logPath, logMessage + '\n', function (error) {
            if (error) {
                var errorMessage = 'ERROR WRITING TO LOG FILE: ' + logPath;
                console.log(errorMessage.red);
            }
        });
    }
};
