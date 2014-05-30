"use strict";

var logger = require("../util/logger"),
    sqlite3 = require("sqlite3").verbose(),
    CommonError = require("../util/commonerror"),
    _ = require("lodash");

module.exports = function(options) {
    var db = new sqlite3.Database(options.fileName);

    function constructWhereCondition(queryColumns, queryValues, exact) {
        var query = "";
        if (queryValues.length === queryColumns.length && queryColumns.length) {
            query = " WHERE " + queryColumns.map(function(currentColumn) {
                if (exact) {
                    return currentColumn + " = ?";
                } else {
                    return currentColumn + " LIKE '%'||?||'%'";
                }
            }).join(", ");
        }
        return query;
    }

    return {
        "setup": function() {
            db.serialize(function() {
                db.run("PRAGMA foreign_keys = ON");

                db.run("CREATE TABLE IF NOT EXISTS Contacts (ID INTEGER PRIMARY KEY," +
                    " Name TEXT, CountryCode INTEGER NOT NULL," +
                    " Number TEXT NOT NULL, UNIQUE(CountryCode, Number))");

                db.run("CREATE TABLE IF NOT EXISTS SpeedDial (ID INTEGER PRIMARY KEY," +
                    " ContactID INTEGER REFERENCES Contacts(ID) ON UPDATE " +
                    " CASCADE ON DELETE CASCADE)");

                db.run("CREATE TABLE IF NOT EXISTS CallLogs (ID INTEGER PRIMARY KEY," +
                    " Name TEXT, Number TEXT NOT NULL, CallTime INTEGER)");
            });
        },

        "cleanup": function() {
            logger("DEBUG", "Closing the DB Connection now.");
            db.close();
        },

        "fetch": function(database, table, options, callBack) {
            var tableName = database && _.isString(database) ? database + "." : "" + table,
                columns = options.columns,
                query = "SELECT " +
                (_.isArray(columns) ? columns.join(", ") : columns) + " FROM " + tableName,
                queryValues = [],
                queryColumns = [],
                statement;

            if (_.isPlainObject(options.criteria)) {
                queryValues = _.values(options.criteria);
                queryColumns = _.keys(options.criteria);
            }

            query += constructWhereCondition(queryColumns, queryValues, options.exact);

            if (_.isPlainObject(options.sort)) {
                query += " ORDER BY " + _.keys(options.sort).map(function(currentColumn) {
                    return currentColumn + " " + options.sort[currentColumn];
                }).join(", ");
            }
            logger("DEBUG", query);

            statement = db.prepare(query);
            statement.all(queryValues, callBack || function() {});
            statement.finalize();
        },

        "purge": function(database, table, queryFields) {
            var tableName = database && _.isString(database) ? database + "." : "" + table,
                query = "DELETE FROM " + tableName,
                values, columns, statement;

            if (_.isPlainObject(queryFields)) {
                values = _.values(queryFields);
                columns = _.keys(queryFields);
                query += " WHERE " + columns.map(function(currentColumn) {
                    return currentColumn + " = ?";
                }).join(", ");
            }
            logger("DEBUG", query);
            db.run(query, values);
        },

        "insert": function(database, table, columns, values) {
            var tableName = database && _.isString(database) ? database + "." : "" + table,
                query = "INSERT INTO " + tableName + " ";

            if (_.isPlainObject(columns)) {
                values = _.values(columns);
                columns = _.keys(columns);
            }
            if (_.isArray(columns) && _.isArray(values) && columns.length === values.length) {
                query += "(" + columns.join(", ") + ") ";
            } else if (columns !== "*" || !_.isArray(values)) {
                throw new CommonError("Inconsistent input to Insert", arguments);
            }

            query += "VALUES (" + new Array(values.length + 1).join("?").split("").join(", ") + ")";
            logger("DEBUG", query);
            db.run(query, values);
        },

        "update": function(database, table, updateData, queryFields) {
            var tableName = database && _.isString(database) ? database + "." : "" + table,
                query = "UPDATE " + tableName + " SET ",
                updateColumns, updateValues, columns, values = [];
            if (_.isPlainObject(updateData) && _.keys(updateData).length) {
                updateColumns = _.keys(updateData);
                updateValues = _.values(updateData);
                query += updateColumns.map(function(currentColumn) {
                    return currentColumn + " = ?";
                }).join(", ");
            } else {
                throw new CommonError("Update fields not specified", arguments);
            }

            if (_.isPlainObject(queryFields)) {
                columns = _.keys(queryFields);
                values = _.values(queryFields);
                query += " WHERE " + columns.map(function(currentColumn) {
                    return currentColumn + " = ?";
                }).join(", ");
            }

            logger("DEBUG", query);
            db.run(query, updateValues.concat(values));
        },

        "selectQuery": function(query, values, callBack) {
            var statement = db.prepare(query);
            statement.all(values, callBack);
            statement.finalize();
        },

        "query": function(query, values, callBack) {
            db.run(query, values, callBack);
        }
    };
};