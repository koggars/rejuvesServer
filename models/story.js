/*
 * story.js
 * News story/article model
 */

var Sequelize  = require('sequelize');
var connection = require('../common/connection.js');
var User       = require('./user.js');

var Story = connection.define('Story', {
	title:     Sequelize.STRING,
	content:   Sequelize.TEXT,
	webUrl:    Sequelize.STRING,
	imgUrl:    Sequelize.STRING,
	upload:    Sequelize.BOOLEAN,
	approved:  Sequelize.BOOLEAN
});

Story.belongsTo(User);
User.hasMany(Story);

module.exports = Story;
