var modelBase = require("./ModelBase"),
    util = require("util");

function Contact(obj) {
    modelBase.call(obj, "", "Contacts");
    return obj;
}

util.inherits(Contact, modelBase);

module.exports = Contact;
