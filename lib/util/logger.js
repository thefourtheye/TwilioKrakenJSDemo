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

module.exports = function(type, formatString) {
    var obj  = messageTypes[_.has(messageTypes, type) ? type : "DEBUG"],
        args = Array.prototype.slice.call(arguments, 2);
    obj.func(util.format.apply(null, ["%s " + formatString, obj.type].concat(args)));
};
