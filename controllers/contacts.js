"use strict";

var _ = require("lodash"),
    CommonError = require("../lib/util/commonerror"),
    logger = require("../lib/util/logger"),
    Contacts = require("../models/Contact"),
    numberRegEx = /^\d+$/;

function purge(criteria, callBack) {
    new Contacts(criteria).purge(callBack);
}

function update(operation, object, criteria, callBack) {
    if (!_.isString(object.CountryCode) && !_.isString(object.Number) || !object.CountryCode.match(numberRegEx) || !object.Number.match(numberRegEx)) {
        throw new Error("Number and Country Code fields can have only numbers!");
    } else {
        var contact = new Contacts({
            Name: object.Name,
            CountryCode: parseInt(object.CountryCode, 10),
            Number: object.Number
        });

        if (operation === "insert") {
            contact.insert(callBack);
        } else {
            contact.update({
                ID: object.ID
            }, callBack);
        }
    }
}

module.exports = function(app) {
    app.post("/contacts", function(req, res) {

        function callBack(err, result) {
            if (err) {
                logger("ERROR", err.message);
                return res.send(403, err.message);
            } else {
                return res.send(200, result);
            }
        }

        try {
            var result;
            if (_.has(req.body, "type") && req.body.type) {
                if (req.body.type === "delete") {
                    purge({
                        ID: req.body.ID
                    }, callBack);
                } else if (req.body.type === "update") {
                    update(req.body.type, req.body, {
                        ID: req.body.ID
                    }, callBack);
                } else if (req.body.type === "insert") {
                    update(req.body.type, req.body, null, callBack);
                } else {
                    logger("ERROR", "Invalid Contact operation");
                    res.send(403, "Invalid Contact operation");
                }
            } else {
                logger("ERROR", "Contact operation not found");
                res.send(403, "Contact operation not found");
            }
        } catch (exception) {
            logger("ERROR", exception.message);
            res.send(403, "Server was unable to process the request at this time");
        }

    });
};