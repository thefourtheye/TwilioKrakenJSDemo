var modelBase = require("./ModelBase"),
    util = require("util");

function CallLog(obj) {
    modelBase.call(obj, "", "CallLog");
    return obj;
}

util.inherits(CallLog, modelBase);

module.exports = CallLog;
