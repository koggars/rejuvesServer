/*
 * embedly.js
 * Simple Embedly API wrapper
 */

var querystring = require('querystring');
var request     = require('request');
var util        = require('util');

var embedly = function(key, version) {
	this.key = key;
	this.version = version || '1';
};

embedly.prototype._apiCall = function(endpoint, version, parameters, cb) {
	if (parameters.urls && typeof parameters.urls == 'object')
		parameters.urls = parameters.urls.join(',');

	parameters.key = this.key;

	var qs = querystring.stringify(parameters);
	var url = util.format('https://api.embed.ly/%s/%s?%s', version, endpoint, qs);

	request.get({url:url, json:true}, cb);
};

embedly.prototype.extract = function(parameters, cb) {
	this._apiCall('extract', this.version, parameters, cb);
};

module.exports = embedly;
