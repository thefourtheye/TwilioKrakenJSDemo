"use strict";

var _ = require("lodash"),
    CommonError = require("../lib/util/commonerror"),
    logger = require("../lib/util/logger"),
    SpeedDial = require("../models/SpeedDial");

module.exports = function(app) {
    app.post("/speeddial", function(req, res) {

        function callBack(err, result) {
            if (err) {
                logger("ERROR", err.message);
                return res.send(403, "Server was unable to process the request at this time");
            } else {
                return res.send(200);
            }
        }
        if (_.isString(req.body.type) && req.body.type) {
            if (req.body.type === "insert") {
                new SpeedDial({
                    ID: req.body.ID,
                    ContactID: req.body.ContactID
                }).insert(callBack);
            } else if (req.body.type === "delete") {
                new SpeedDial({
                    ID: req.body.ID
                }).purge(callBack);
            } else {
                logger("ERROR", "Invalid SpeedDial operation");
                res.send(403, "Invalid SpeedDial operation");
            }
        } else {
            logger("ERROR", "SpeedDial operation not found in the request");
            res.send(403, "SpeedDial operation not found in the request");
        }
    });
};