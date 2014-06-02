"use strict";

var _ = require("lodash"),
    CommonError = require("../lib/util/commonerror"),
    logger = require("../lib/util/logger"),
    nconf = require("nconf"),
    CallLog = require("../models/CallLog");

module.exports = function(app) {
    app.post("/call", function(req, res) {
        try {
            var accountSid = nconf.get("SID"),
                authToken = nconf.get("SToken"),
                myNumber = nconf.get("MyNumber"),
                client = require("twilio")(accountSid, authToken);

            client.calls.create({
                to: req.body.number,
                from: myNumber,
                method: "GET",
                fallbackMethod: "GET",
                statusCallbackMethod: "GET",
                record: "false",
                url: "http://twilio-krakenjs-demo.herokuapp.com/acceptedCall"
            });
            new CallLog({
                "Name": req.body.name || "",
                "Number": req.body.number || "",
                "CallTime": (new Date()).getTime()
            }).insert();
            res.send(200);
        } catch (exception) {
            logger("ERROR", exception);
            res.send(403, exception.message);
        }
    });

    app.get("/acceptedCall", function(req, res) {
        res.set("Content-Type", "text/xml");
        res.send("<?xml version=\"1.0\" encoding=\"UTF-8\" ?><Response>" +
            "<Say>Hello from twilio Kraken JS demo application</Say></Response>");
    });
};