/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var app = require('../index'),
    kraken = require('kraken-js'),
    request = require('supertest'),
    assert = require('assert');

describe('Functional Tests for Contacts', function() {

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

    it('Add a new contact', function(done) {
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
                request(mock)
                    .post('/loadtables')
                    .send({
                        'tablename': 'Contacts',
                    })
                    .expect(200)
                    .end(function(err, res) {
                        var contact = res.body[0];
                        if (contact.Name !== "Tester" || contact.CountryCode !== 91 || contact.Number !== '0123456789') {
                            done(new Error("Add a new contact FAILED!!!"));
                        } else if (err) {
                            done(err);
                        } else {
                            request(mock)
                                .post('/contacts')
                                .send({
                                    'type': 'delete',
                                    'ID': contact.ID
                                })
                                .expect(200)
                                .end(done);
                        }
                    })
            });
    });

    it('Fail on duplicate contacts', function(done) {
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
                request(mock)
                    .post('/contacts')
                    .send({
                        'type': 'insert',
                        'Name': 'Tester',
                        'CountryCode': '91',
                        'Number': '0123456789'
                    })
                    .expect(403)
                    .end(function(err1, res) {
                        request(mock)
                            .post('/contacts')
                            .send({
                                'type': 'delete',
                                'ID': 1
                            })
                            .expect(200)
                            .end(function() {
                                done(err);
                            });
                    })
            });
    });

    it('Edit a contact', function(done) {
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
                return request(mock)
                    .post('/contacts')
                    .send({
                        'type': 'update',
                        'ID': '1',
                        'Name': 'Tester1',
                        'CountryCode': '911',
                        'Number': '01234567891'
                    })
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        return request(mock)
                            .post('/loadtables')
                            .send({
                                'tablename': 'Contacts',
                            })
                            .expect(200)
                            .end(function(err, res) {
                                if (err) return done(err);
                                var contact = res.body[0];
                                if (contact.Name === "Tester" || contact.CountryCode === 91 || contact.Number === '0123456789') {
                                    done(new Error("Update contact FAILED!!!"));
                                } else if (err) {
                                    done(err);
                                } else {
                                    request(mock)
                                        .post('/contacts')
                                        .send({
                                            'type': 'delete',
                                            'ID': 1
                                        })
                                        .expect(200)
                                        .end(done);
                                }
                            });
                    })
            })
    });

    it('Delete a contact', function(done) {
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
                request(mock)
                    .post('/contacts')
                    .send({
                        'type': 'delete',
                        'ID': 1
                    })
                    .expect(200)
                    .end(function(err, res) {
                        request(mock)
                            .post('/loadtables')
                            .send({
                                'tablename': 'Contacts',
                            })
                            .expect(200)
                            .end(function(err, res) {
                                if (res.body.length) {
                                    done(new Error("Delete contact FAILED!!!"));
                                } else {
                                    done(err);
                                }
                            });
                    });
            });
    });

    it('Invalid contact operation', function(done) {
        request(mock)
            .post('/contacts')
            .send({
                'type': 'call'
            })
            .expect(403)
            .expect("Invalid Contact operation")
            .end(done);
    });

    it('Missing contact operation', function(done) {
        request(mock)
            .post('/contacts')
            .send({})
            .expect(403)
            .expect("Contact operation not found in the request")
            .end(done);
    });

});