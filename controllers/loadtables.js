'use strict';
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
        CallLogs: null
    };

module.exports = function(app) {
    app.post('/loadtables', function(req, res) {
        if (_.has(req.body, "tablename") && _.has(Tables, req.body.tablename)) {
            new Tables[req.body.tablename]()
                .select("*", false, DefaultSortObjects[req.body.tablename], function(err, rows) {
                if (err) {
                    throw new CommonError(err);
                } else {
                    res.send(rows);
                }
            })
        } else {
            logger("ERROR", "Table name is not specified/not valid.");
            res.send(403);
        }
        // if(_.has(req.body, "tablename")) {
        //     new Contact({"Name": req.body.key}).select("*", false, function(err, names) {
        //         if (err) {
        //             res.send(500);
        //         } else {
        //             new Contact({"Number": req.body.key}).select("*", false, function(err1, numbers) {
        //                 if (err1) {
        //                     res.send(500);
        //                 } else {
        //                     res.send({
        //                         "results": _.uniq(names.concat(numbers), false, function(currentObject) {
        //                             return currentObject.ID;
        //                         })
        //                     });
        //                 }
        //             });
        //         }
        //     });
        // }

    });
};