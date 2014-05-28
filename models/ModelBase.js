'use strict';

var db = require("./lib/db/dbmanager.js").getDBObject(),
    _ = require("lodash");

function Model(database, table) {
    this.__database = database;
    this.__table = table;
}

Model.prototype.select = function(callBack) {
    db.fetch(this.__database, this.__table, _.keys(obj), _.values(obj), callBack);
};

Model.prototype.insert = function() {
    db.insert(this.__database, this.__table, obj);
};

Model.prototype.purge = function() {
    db.purge(this.__database, this.__table, obj);
};

Model.prototype.update = function(criteria) {
    db.update(this.__database, this.__table, obj, criteria);
}

Model.prototype.query = db.query;

Model.prototype.selectQuery = db.selectQuery;

module.exports = Model;
