var modelBase = require("./ModelBase"),
    util = require("util");

function SpeedDial(obj) {
    modelBase.call(obj, "", "SpeedDial");
    return obj;
}

util.inherits(SpeedDial, modelBase);

module.exports = SpeedDial;
