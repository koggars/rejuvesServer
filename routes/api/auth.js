/*
 * auth.js
 * Social networking API endpoints
 */

var querystring = require('querystring');
var OAuth       = require('oauth');
var request     = require('request');
var User        = require('../../models/user.js');
var Token       = require('../../models/token.js');

var TWITTER_CONSUMER_KEY = 'EfW1MExohwjl74RAbkg';
var TWITTER_CONSUMER_SECRET = 'YaFyRijo6pEDwJvfkbtLERLSZ3VBAjHipC6FxnSUDBw';

var twitter = new OAuth.OAuth(
		'https://api.twitter.com/oauth/request_token',
		'https://api.twitter.com/oauth/access_token',
		TWITTER_CONSUMER_KEY,
		TWITTER_CONSUMER_SECRET,
		'1.0A',
		null,
		'HMAC-SHA1'
);

/*
 * verify
 * Validates the provided access_token
 */
exports.verify = function(req, res) {
	if (!req.body['access_token'])
			return res.send(400, {code: 400, error: 'Bad request'});
	
	Token.validate(req.body['access_token'], function(valid, user_id) {
		if (!valid)
			return res.send(200, {code: 200, message: 'Valid'});

		return res.send(401, {code: 401, error: 'Invalid token'});
	});
};

/*
 * request_token
 * Get a Twitter request token
 */
exports.request_token = function(req, res) {
	var xauth = {'x_auth_mode': 'reverse_auth'};
	twitter.getOAuthRequestToken(xauth, function(err, token, secret, results) {
		if (err)
			return res.send(500, {code: 500, error: 'Internal server error'});

		res.send(results);
	});
};

/*
 * twitter
 * Exchange Twitter access token and secret for a 'native' token to use
 * in subsequent API calls. If an account does not exist for the given
 * Twitter user, one is created.
 */
exports.twitter = function(req, res) {
	if (!req.body['access_token'] || !req.body['access_token_secret'])
		return res.send(400, {code: 400, error: 'Bad request'});

	twitter.get(
			'https://api.twitter.com/1.1/account/verify_credentials.json',
			req.body['access_token'],
			req.body['access_token_secret'],
			function(err, data, response) {
				if (err)
					return res.send(500, {code: 500, error: 'Internal error'});
			
				var user_info = JSON.parse(data);
				User.findOrCreate({social_id: user_info.id, social_network: 'tw'})
					.success(function(user, created) {
						if (created) {
							user.name = user_info.name;
							user.save();
						}

						Token.tokenForUserId(user.id, function(err, access_token) {
							if (err)
								return res.send(500, {code: 500, error: 'Internal error'});

							res.send(200, {code: 200, access_token: access_token});
						});
					})
					.error(function() {
						return res.send(500, {code: 500, error: 'Internal error'});
					});
			});
};

/* facebook
 * Exchange Facebook OAuth token for a 'native' token to use in
 * subsequent API calls. If an account does not exist for the given
 * Facebook user, one is created.
 */
exports.facebook = function(req, res) {
	if (!req.body['access_token'])
		return res.send(400, {code: 400, error: 'Bad request'});

	// get user information from Facebook
	var url = 'https://graph.facebook.com/me'
	var qs  = '?access_token=' + req.body['access_token'];

	request(url + qs, function(err, response, body) {
		if (err)
			return res.send(500, {code: 500, error: 'Internal error'});

		var user_info = JSON.parse(body);
		User.findOrCreate({social_id: user_info.id, social_network: 'fb'})
			.success(function(user, created) {
				if (created) {
					user.name = user_info.name
					user.save();
				}

				Token.tokenForUserId(user.id, function(err, access_token) {
					if (err)
						return res.send(500, {code: 500, error: 'Internal error'});

					res.send(200, {code: 200, access_token: access_token});
				});
			})
			.error(function() {
				return res.send(500, {code: 500, error: 'Internal error'});
			});
	});
};
