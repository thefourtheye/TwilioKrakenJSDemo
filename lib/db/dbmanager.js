"use strict";

var _ = require("lodash"),
    CommonError = require("../util/commonerror"),
    dbMethods = ["fetch", "purge", "insert", "setup", "cleanup", "update", "query", "selectQuery"],
    logger = require("../util/logger"),
    dbObject;

function checkOptionsObject(options) {
    if (!_.isPlainObject(options) || !_.isString(options.name) || options.name === "") {
        throw new CommonError("DB Options is not a valid object/name property is not valid!");
    }
}

function initialize(options) {
    options = options || {};

    checkOptionsObject(options);

    try {
        dbObject = require("./" + options.name);
    } catch (exception) {
        throw new CommonError("Module ./" + options.name + " is not found.");
    }

    if (!_.isFunction(dbObject) || !isValidDBObject(dbObject = dbObject(options))) {
        throw new CommonError("Invalid DB Object found, initialization failed.");
    }

    dbObject.setup();
}

function isValidDBObject(dbObject) {
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