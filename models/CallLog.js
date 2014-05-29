var modelBase = require("./ModelBase"),
    util = require("util");

function CallLog(obj) {
    modelBase.call(this, "", "CallLogs");
    this.__data = obj;
}

util.inherits(CallLog, modelBase);

module.exports = CallLog;
