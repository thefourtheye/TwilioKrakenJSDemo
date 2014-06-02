"use strict";

var _ = require("lodash"),
    CommonError = require("../lib/util/commonerror"),
    logger = require("../lib/util/logger"),
    Tables = {
        Contacts: require("../models/Contact"),
        SpeedDial: require("../models/SpeedDial"),
        CallLogs: require("../models/CallLog")
    },
    DefaultSortObjects = {
        Contacts: {
            "Name": "ASC"
        },
        SpeedDial: null,
        CallLogs: {
            "CallTime": "DESC"
        }
    };

module.exports = function(app) {
    app.post("/loadtables", function(req, res) {
        if (_.has(req.body, "tablename") && _.has(Tables, req.body.tablename)) {
            var table = req.body.tablename;
            new Tables[table]()
                .select("*", false, DefaultSortObjects[table], function(err, rows) {
                    if (err) {
                        throw new CommonError(err);
                    } else {
                        res.send(rows);
                    }
                });
        } else {
            logger("ERROR", "Table name is not specified/not valid.");
            res.send(403, "Table name is not specified/not valid.");
        }
    });
};
