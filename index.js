'use strict';

var kraken = require('kraken-js'),
    lusca = require('lusca'),
    dbManager = require("./lib/db/dbmanager.js"),
    app = {},
    db, conf;

app.configure = function configure(nconf, next) {
    // Async method run on startup.
    dbManager.initialize(nconf.get("database"));
    db = dbManager.getDBObject();
    process.on('exit', db.cleanup.bind(db));
    conf = nconf;
    next(null);
};

app.requestStart = function requestStart(server) {
    server.use(require('cookie-parser')());
    server.use(require('body-parser')());
};

app.requestBeforeRoute = function requestBeforeRoute(server) {
    // Run before any routes have been added.
    server.use(require('express-session')({
        "secret": conf.get("SessionSecret")
    }));
    server.use(lusca.csrf());
    server.use(lusca.xframe('SAMEORIGIN'));
    server.use(lusca.xssProtection(true));
};

app.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.
};

if (require.main === module) {
    kraken.create(app).listen(function(err) {
        if (err) {
            console.error(err.stack);
        }
    });
}

module.exports = app;