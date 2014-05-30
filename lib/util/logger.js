"use strict";

var util = require("util"),
    _ = require("lodash"),
    messageTypes = {
        "WARNING": {
            type: "[WARNING]",
            func: console.warn
        },
        "ERROR": {
            type: "[ERROR  ]",
            func: console.error
        },
        "DEBUG": {
            type: "[DEBUG  ]",
            func: console.log
        }
    };

module.exports = function(type) {
    var obj  = messageTypes[_.has(messageTypes, type) ? type : "DEBUG"],
        args = Array.prototype.slice.call(arguments, 1);
    obj.func.apply(null, [obj.type].concat(args));
};
