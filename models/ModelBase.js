"use strict";

var db = require("../lib/db/dbmanager.js").getDBObject(),
    _ = require("lodash");

function Model(database, table) {
    this.__database = database;
    this.__table = table;
}

Model.prototype.select = function(columns, exact, sort, callBack) {
    db.fetch(this.__database, this.__table, {
        columns: columns,
        sort: sort,
        exact: exact,
        criteria: this.__data
    }, callBack);
};

Model.prototype.insert = function(callBack) {
    db.insert(this.__database, this.__table, this.__data, callBack);
};

Model.prototype.purge = function(callBack) {
    db.purge(this.__database, this.__table, this.__data, callBack);
};

Model.prototype.update = function(criteria, callBack) {
    db.update(this.__database, this.__table, this.__data, criteria, callBack);
};

Model.prototype.query = db.query;

Model.prototype.selectQuery = db.selectQuery;

module.exports = Model;