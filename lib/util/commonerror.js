var util   = require("util"),
    logger = require("./logger");

function CommonError(errorMessage) {
    Error.call(this, errorMessage);
    logger("ERROR", errorMessage);
}

util.inherits(CommonError, Error);

module.exports = CommonError;
