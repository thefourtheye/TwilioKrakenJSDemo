/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var app = require('../index'),
    kraken = require('kraken-js'),
    request = require('supertest'),
    assert = require('assert');

describe('Functional Tests for SpeedDial', function() {

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

    it('Add a new SpeedDial Entry', function(done) {
        request(mock)
            .post('/contacts')
            .send({
                'type': 'insert',
                'Name': 'Tester',
                'CountryCode': '91',
                'Number': '0123456789'
            })
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                request(mock)
                    .post('/speeddial')
                    .send({
                        'type': 'insert',
                        'ID': '0',
                        'ContactID': '1'
                    })
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        request(mock)
                            .post('/loadtables')
                            .send({
                                'tablename': 'SpeedDial'
                            })
                            .expect(200)
                            .end(function(err, res) {
                                if (err) return done(err);
                                if (res.body.length) {
                                    var entry = res.body[0];
                                    if (entry.ID !== 0 || entry.ContactID !== 1) {
                                        done(new Error("SpeedDial entry creation failed"));
                                    } else {
                                        done(err);
                                    }
                                } else {
                                    done(new Error("SpeedDial entry creation failed"));
                                }
                            });
                    })
            });

    });

    it('Fail on an invalid contact', function(done) {
        request(mock)
            .post('/speeddial')
            .send({
                'type': 'insert',
                'ID': 0,
                'ContactID': 1000
            })
            .expect(403)
            .expect("Server was unable to process the request at this time")
            .end(done);
    });

    it('Delete a SpeedDial entry', function(done) {
        request(mock)
            .post('/speeddial')
            .send({
                'type': 'delete',
                'ID': '0'
            })
            .expect(200)
            .end(done);
    });

    it('Invalid SpeedDial operation', function(done) {
        request(mock)
            .post('/speeddial')
            .send({
                'type': 'call'
            })
            .expect(403)
            .expect("Invalid SpeedDial operation")
            .end(done);
    });

    it('Missing SpeedDial operation', function(done) {
        request(mock)
            .post('/speeddial')
            .send({})
            .expect(403)
            .expect("SpeedDial operation not found in the request")
            .end(done);
    });

});