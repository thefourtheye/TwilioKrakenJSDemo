var _           = require("lodash"),
    CommonError = require("../util/commonerror"),
    dbMethods   = ["fetch", "delete", "insert", "setup"],
    logger      = require("../util/logger"),
    dbObject;

function initialize(options) {
    options = options || {};
    if (!_.isPlainObject(options)) {
        throw new CommonError("DB Options should be a plain object!");
    }

    if (!_.isString(options.name) || options.name === "") {
        throw new CommonError("DB Options doesn't have `name` property.");
    }

    try {
        dbObject = require("./" + options.name);
    } catch (exception) {
        logger("WARNING", "Module [%s] is not found.", "./" + options.name);
    }

    dbObject = _.isFunction(dbObject) ? dbObject(options) : dbObject;
    if (!isValidDBObject()) {
        throw new CommonError("Invalid DB Object found, initialization failed.");
    }
}

function isValidDBObject() {
    return _.isObject(dbObject) && _.every(dbMethods, function(currentMethod) {
        return _.isFunction(dbObject[currentMethod]);
    });
}

function getDBObject() {
    if (isValidDBObject(dbObject)) {
        return dbObject;
    } else {
        throw new CommonError("DB Object hasn't been initialized or valid methods not found.");
    }
}

module.exports = {
    initialize: initialize,
    getDBObject: getDBObject
};
