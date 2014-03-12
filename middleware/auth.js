/*
 * auth.js
 *
 * Request authentication middleware
 */

var User    = require('../models/user.js');
var Admin   = require('../models/admin.js');
var Token   = require('../models/token.js');
var redis   = require('../common/redisConnection.js');
var express = require('express');
var bcrypt  = require('bcrypt');

function invalidRequest(res) {
	res.send(401, {code: 401, error: 'Invalid request'});
}

exports.api = function(req, res, next) {
	var auth_string  = req.get('Authorization') || '';
	var components   = auth_string.split(' ');

	if (components.length != 3)
		return invalidRequest(res);

	var time = Math.floor(Date.now() / 1000);

	if (time - Number(components[2]) > 60)
		return invalidRequest(res);

	Token.validate(components[0], function(valid, user_id) {
		if (!valid) return invalidRequest(res);

		redis.set('un:' + user_id + ':' + components[1], '1', 'NX',
			'EX', '60', function(err, result) {
				if (err || !result) return invalidRequest(res);

				req.user_id = user_id;
				next();
			});
	});
};

// dashboard basic auth
exports.dash = express.basicAuth(function(user, password, cb) {
	Admin.find({username: user})
		.success(function(admin) {
			if (!admin)
				return cb(new Error('No such account'));

			bcrypt.compare(password, admin.passhash, function(err, result) {
				if (err || !result)
					return cb(new Error('Invalid'));

				cb(null, admin);
			});
		})
		.error(function() {
			cb(new Error('Internal error'));
		});
});
