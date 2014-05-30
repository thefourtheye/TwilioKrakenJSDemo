'use strict';
var _ = require("lodash"),
    CommonError = require("../lib/util/commonerror"),
    logger = require("../lib/util/logger"),
    operations = ["add", "update", "delete"],
    Contacts = require("../models/Contact");

module.exports = function(app) {
    app.post('/contacts', function(req, res) {
        if (_.has(req.body, "type") && operations.indexOf(req.body.type)) {
            if (req.body.type === "delete") {
                new Contacts({
                    ID: req.body.ID
                }).purge();
                res.send(200);
            } else if (req.body.type === "update") {
                var numberRegEx = /^\d+$/;
                if (!req.body.CountryCode || !req.body.Number || !req.body.CountryCode.match(numberRegEx) || !req.body.Number.match(numberRegEx)) {
                    logger("ERROR", "Number and Country Code fields can have only numbers!");
                    res.send(403);
                } else {
                    new Contacts({
                        Name: req.body.Name,
                        CountryCode: parseInt(req.body.CountryCode, 10),
                        Number: req.body.Number
                    }).update({
                        ID: req.body.ID
                    });
                    res.send(200);
                }
            } else if (req.body.type === "insert") {
                var numberRegEx = /^\d+$/;
                if (!req.body.CountryCode || !req.body.Number || !req.body.CountryCode.match(numberRegEx) || !req.body.Number.match(numberRegEx)) {
                    logger("ERROR", "Number and Country Code fields can have only numbers!");
                    res.send(403);
                } else {
                    new Contacts({
                        Name: req.body.Name,
                        CountryCode: parseInt(req.body.CountryCode, 10),
                        Number: req.body.Number
                    }).insert();
                    res.send(200);
                }
            }
        } else {
            logger("ERROR", "Invalid Contact operation");
            res.send(403);
        }
    });
};
