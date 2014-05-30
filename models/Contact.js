"use strict";

var modelBase = require("./ModelBase"),
    util = require("util");

function Contact(obj) {
    modelBase.call(this, "", "Contacts");
    this.__data = obj;
}

util.inherits(Contact, modelBase);

module.exports = Contact;
