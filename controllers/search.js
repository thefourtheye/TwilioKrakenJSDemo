'use strict';
var _ = require("lodash"),
    Contact = require("../models/Contact");

module.exports = function(app) {
    app.post('/search', function(req, res) {
        if(_.has(req.body, "key")) {
            new Contact({"Name": req.body.key}).select("*", false, function(err, names) {
                if (err) {
                    res.send(500);
                } else {
                    new Contact({"Number": req.body.key}).select("*", false, function(err1, numbers) {
                        if (err1) {
                            res.send(500);
                        } else {
                            res.send({
                                "results": _.uniq(names.concat(numbers), false, function(currentObject) {
                                    return currentObject.ID;
                                })
                            });
                        }
                    });
                }
            });
        }
    });
};