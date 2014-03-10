/*
 * user.js
 * User account model
 *
 * Registration for an account is handled by signing in to the application
 * with either a Facebook account or a Twitter account
 */

var Sequelize  = require('sequelize');
var connection = require('../common/connection.js');

var User = connection.define('User', {
	social_network:  Sequelize.STRING,
	social_id:			 Sequelize.BIGINT,
	name:						 Sequelize.STRING
});

module.exports = User;
