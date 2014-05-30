"use strict";

var _ = require("lodash"),
    CommonError = require("../lib/util/commonerror"),
    logger = require("../lib/util/logger"),
    SpeedDial = require("../models/SpeedDial");

module.exports = function(app) {
    app.post("/speeddial", function(req, res) {
        if (_.has(req.body, "type")) {
            if (req.body.type === "insert") {
                new SpeedDial({
                    ID: req.body.ID,
                    ContactID: req.body.ContactID
                }).insert();
            } else if (req.body.type === "delete") {
                new SpeedDial({
                    ID: req.body.ID
                }).purge();
            }
            res.send(200);
        } else {
            res.send(403);
        }
    });
};
