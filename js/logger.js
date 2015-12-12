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
var logger = function (messageParts, fileName, isError, skipLine) {
    var logMessage = moment().format() + ' ';

    if (fileName) {
        var fileParts = fileName.split('/');
        logMessage += fileParts.pop() + ' :: ';
    }

    if (isError) {
        logMessage += 'ERROR: ';
    }

    for (var i=0; i < messageParts.length; i++) {
        var part = messageParts[i];
        if (typeof part === 'string' || part instanceof String) {
            logMessage += part;
        } else {
            var jsonPart = JSON.stringify(part);
            if (jsonPart && jsonPart.length > 1 && jsonPart[0] === '"') {
                jsonPart = jsonPart.substring(1, jsonPart.length);
            }

            if (jsonPart && jsonPart.length > 1 && jsonPart[jsonPart.length - 1] === '"') {
                jsonPart = jsonPart.substring(0, jsonPart.length - 1);
            }

            logMessage += jsonPart;
        }

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

if (process.argv.length > 2 && process.argv[2] === 'testlogger') {
    logger(
        ['testing the logger with object: ', {message: 'Hi there. Just testing', times:3}, 'weeee'],
        __filename,
        false,
        false
    );
}

module.exports = logger;
