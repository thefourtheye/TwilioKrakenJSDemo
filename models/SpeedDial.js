"use strict";

var modelBase = require("./ModelBase"),
    util = require("util");

function SpeedDial(obj) {
    modelBase.call(this, "", "SpeedDial");
    this.__data = obj;
}

util.inherits(SpeedDial, modelBase);

module.exports = SpeedDial;
