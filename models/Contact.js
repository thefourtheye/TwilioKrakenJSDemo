var db = require("./lib/db/dbmanager.js").getDBObject(),
    _ = require("lodash");

function Contact(obj) {
    var database = "",
        table = "Contacts";

    return {
        "select": function(callBack) {
            db.fetch(database, table, _.keys(obj), _.values(obj), callBack);
        },
        "insert": function() {
            db.insert(database, table, obj);
        },
        "purge": function() {
            db.purge(database, table, obj);
        },
        "update": function(criteria) {
            db.update(database, table, obj, criteria);
        },
        "query": db.query,
        "selectQuery": db.selectQuery
    }
}

module.exports = Contact;
