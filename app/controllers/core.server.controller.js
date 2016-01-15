'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash');

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

// save action log into DB
exports.saveAction = function(req, res){
    var item = req.body.item;
    if (item.previousTime === undefined)
        item.previousTime = -1;
    item.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    item.eventTimestamp = (new Date()).valueOf();
    var Item = mongoose.model('newAction');
    var insertItem = new Item(item);

    insertItem.save();
    res.send('successful');
    res.end();
}
