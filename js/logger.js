'use strict';

var colors = require('colors');
var fs = require('fs');
var moment = require('moment');

var logPath = process.env.COLOR_LOG_PATH || null;

/**
 *
 * @param messageParts - Array of Objects
 * @param fileName - String
 * @param isError - Boolean
 * @param skipLine - Boolean
 */
module.exports = function (messageParts, fileName, isError, skipLine) {
    var logMessage = moment().format() + ' ';

    if (fileName) {
        var fileParts = fileName.split('/');
        logMessage += fileParts.pop() + ' :: ';
    }

    if (isError) {
        logMessage += 'ERROR: ';
    }

    for (var i=0; i < messageParts.length; i++) {
        logMessage += JSON.stringify(messageParts[i]);
        if (i !== messageParts.length - 1) {
            logMessage += ' ';
        }
    }

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
