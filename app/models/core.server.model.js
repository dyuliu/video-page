'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var newActionSchema = new Schema({
	'currentTime': Number,
	'previousTime': Number,
	'playbackRate': Number,
	'paused': Boolean,
	'types': String,
	'username': String,
	'displayName': String,
	'eventTimestamp': Number,
	'videoId': String,
	'ip': String
}, {collection: 'newAction'});

mongoose.model('newAction', newActionSchema);
