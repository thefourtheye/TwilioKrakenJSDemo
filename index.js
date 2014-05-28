'use strict';

var kraken = require('kraken-js'),
    app = {},
    dbManager = require("./lib/db/dbmanager.js"),
    db;

app.configure = function configure(nconf, next) {
    // Async method run on startup.
    dbManager.initialize(nconf.get("database"));
    db = dbManager.getDBObject();
    process.on('exit', db.cleanup.bind(db));
    next(null);
};

app.requestStart = function requestStart(server) {

};

app.requestBeforeRoute = function requestBeforeRoute(server) {
    // Run before any routes have been added.
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
