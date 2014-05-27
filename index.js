'use strict';

var kraken = require('kraken-js'),
    app = {},
    db = require("./lib/db/DBManager.js");


app.configure = function configure(nconf, next) {
    // Async method run on startup.
    db.initialize(nconf.get("database"));
    next(null);
};


app.requestStart = function requestStart(server) {
    // var sqlite3 = require('sqlite3').verbose();
    // var db = new sqlite3.Database('Database.sqlite3');

    // db.serialize(function() {
    //     // db.run("DROP TABLE IF EXISTS lorem");
    //     // db.run("CREATE TABLE lorem (info TEXT)");
    //     db.run("CREATE TABLE IF NOT EXISTS lorem (info TEXT)");

    //     var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    //     for (var i = 0; i < 3; i++) {
    //         stmt.run("Ipsum " + i);
    //     }
    //     stmt.finalize();

    //     db.all("SELECT rowid AS id, info FROM lorem", function(err, rows) {
    //         console.log(rows);
    //     });
    // });

    // db.close();
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