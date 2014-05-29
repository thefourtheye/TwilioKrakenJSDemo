'use strict';
var _ = require("lodash"),
    CommonError = require("../lib/util/commonerror"),
    logger = require("../lib/util/logger"),
    nconf = require("nconf"),
    accountSid = nconf.get("SID"),
    authToken = nconf.get("SToken"),
    myNumber = nconf.get("MyNumber");

module.exports = function(app) {
    app.post('/call', function(req, res) {
        var client = require('twilio')(accountSid, authToken);
        client.calls.create({
            to: req.body.number,
            from: myNumber,
            method: "GET",
            fallbackMethod: "GET",
            statusCallbackMethod: "GET",
            record: "false",
            url: "http://twilio-krakenjs-demo.herokuapp.com/acceptedCall"
        });
        res.send(200);
    });

    app.get('/acceptedCall', function(req, res) {
        console.log(req.body);
        res.set('Content-Type', 'text/xml');
        res.send('<?xml version="1.0" encoding="UTF-8" ?><Response>' +
            "<Say>Hello from twilio-krakenjs-demo application</Say></Response>");
    });
}