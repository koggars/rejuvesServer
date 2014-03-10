/*
 * like.js
 * Model to represent the 'Rejuved' action of a user in
 * relation to an article they have read
 */

var User       = require('./user.js');
var Story      = require('./story.js');
var connection = require('../common/connection.js');

var Like = connection.define('Like', {});

Like.belongsTo(Story);
Like.belongsTo(User);
Story.hasMany(Like);
User.hasMany(Like);

module.exports = Like;
