'use strict';


var kraken = require('kraken-js'),
    app = {},
    db = require("sqlite3");


app.configure = function configure(nconf, next) {
    // Async method run on startup.
    next(null);
};


app.requestStart = function requestStart(server) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('Database.sqlite3');

    db.serialize(function() {
        db.run("CREATE TABLE lorem (info TEXT)");

        var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
        for (var i = 0; i < 10; i++) {
            stmt.run("Ipsum " + i);
        }
        stmt.finalize();

        db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
            console.log(row.id + ": " + row.info);
        });
    });

    db.close();
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