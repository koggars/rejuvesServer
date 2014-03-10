/*
 * admin.js
 * Admin account model
 */

var connection = require('../common/connection.js');
var Sequelize  = require('sequelize');

var Admin = connection.define('Admin', {
	fullname: Sequelize.STRING,
	username: Sequelize.STRING,
	passhash: Sequelize.STRING
});

module.exports = Admin;
