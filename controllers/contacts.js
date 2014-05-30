"use strict";

var _ = require("lodash"),
    CommonError = require("../lib/util/commonerror"),
    logger = require("../lib/util/logger"),
    operations = ["add", "update", "delete"],
    Contacts = require("../models/Contact"),
    numberRegEx = /^\d+$/;

function purge(criteria, res) {
    try {
        new Contacts(criteria).purge();
        return [200];
    } catch (exception) {
        logger("ERROR", exception.message);
    }
    return [403, "Server was unable to process the request at this time"];
}

function update(operation, object, criteria) {
    try {
        if (!_.isString(object.CountryCode) && !_.isString(object.Number) || !object.CountryCode.match(numberRegEx) || !object.Number.match(numberRegEx)) {
            logger("ERROR", "Number and Country Code fields can have only numbers!");
            return [403, "Number and Country Code fields can have only numbers!"];
        } else {
            var contact = new Contacts({
                Name: object.Name,
                CountryCode: parseInt(object.CountryCode, 10),
                Number: object.Number
            });

            if (operation === "insert") {
                contact.insert();
            } else {
                contact.update({
                    ID: object.ID
                });
            }
        }
    } catch (exception) {
        logger("ERROR", exception.message);
        return [403, "Server was unable to process the request at this time"];
    }
    return [200];
}

module.exports = function(app) {
    app.post("/contacts", function(req, res) {
        var result;
        if (_.has(req.body, "type") && operations.indexOf(req.body.type)) {
            if (req.body.type === "delete") {
                result = purge({
                    ID: req.body.ID
                });
            } else if (req.body.type === "update") {
                result = update(req.body.type, req.body, {
                    ID: req.body.ID
                }, res);
            } else if (req.body.type === "insert") {
                result = update(req.body.type, req.body, null, res);
            }
        } else {
            logger("ERROR", "Invalid Contact operation");
            return res.send(403, "Invalid Contact operation");
        }
        res.send.apply(res, result);
    });
};