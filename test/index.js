/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';

var app = require('../index'),
    kraken = require('kraken-js'),
    request = require('supertest'),
    assert = require('assert'),
    nconf = require('nconf');

describe('Functional Tests for Calling', function() {

    var mock;

    beforeEach(function(done) {
        process.env.NODE_ENV = "testing";
        kraken.create(app).listen(function(err, server) {
            mock = server;
            done(err);
        });
    });

    afterEach(function(done) {
        mock.close(done);
    });

    it('acceptedcall should return the XML', function(done) {
        request(mock)
            .get('/acceptedcall')
            .expect(200)
            .expect('Content-Type', /xml/)
            .expect(/Hello from/)
            .end(done);
    });

    it('calling a number with Twilio', function(done) {

        nconf.defaults({
            'SID': 'dummySID',
            'MyNumber': 'dummyMyNumber',
            'SToken': 'dummyToken'
        });

        request(mock)
            .post('/call')
            .send({
                "number": "+11234567890",
                "name": "Dummy"
            })
            .expect(200)
            .end(function(err, res) {
                request(mock)
                    .post('/loadtables')
                    .send({
                        'tablename': 'CallLogs'
                    })
                    .expect(200)
                    .end(function(err, res) {
                        var callLog = res.body[0];
                        if (callLog.Name === "Dummy" && callLog.Number === "+11234567890") {
                            done(err);
                        } else {
                            done(new Error("Call Logs entry not found"));
                        }
                    })
            });
    });

    it('Loading an invalid Table', function(done) {
        request(mock)
            .post('/loadtables')
            .send({
                "tablename": "Dummy"
            })
            .expect(403)
            .expect("Table name is not specified/not valid.")
            .end(done);
    });

    it('Empty table name', function(done) {
        request(mock)
            .post('/loadtables')
            .send({})
            .expect(403)
            .expect("Table name is not specified/not valid.")
            .end(done);
    });
});