/*
 * token.js
 * Access token management using Redis datastore
 *
 * One access token exists at a time for each user
 */
var rconfig = {port: "49153", host: "172.17.0.18"};


var redis  = require('redis').createClient(rconfig.port, rconfig.host);
var crypto = require('crypto');

/*
 * Find or create the access token for the user with
 * user_id. Calls cb(err, access_token) on completion.
 */
exports.tokenForUserId = function(user_id, cb) {
	var key = 'at:' + user_id;
	var token = crypto.randomBytes(64).toString('base64');
	
	redis.setnx(key, token, function(err, res) {
		if (err)
			return cb(err);

		if (res == 1)
			return cb(null, user_id + '-' + token);

		redis.get(key, function(err, res) {
			if (err)
				return cb(err);

			cb(null, user_id + '-' + res);
		});
	});
};

/*
 * Validates an access token against the datastore. Calls
 * cb(valid, user_id) on completion
 */
exports.validate = function(token, cb) {
	var user_id      = token.split('-')[0];
	var token_string = token.split('-')[1];

	var key = 'at:' + user_id;
	redis.get(key, function(err, res) {
		if (err || res != token_string)
			return cb(false);

		cb(true, user_id);
	});
};
