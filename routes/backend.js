/*
 * backend.js
 * Backend dashboard routes
 */

var Story  = require('../models/story.js');
var bcrypt = require('bcrypt');

exports.dashboard = function(req, res) {
	Story.findAll({where: {approved: false}})
		.success(function(stories) {
			res.render('dashboard', {stories: stories});
		});
};

exports.approve = function(req, res) {
	Story.find(req.params.id)
		.success(function(story) {
			if (!story)
				res.send(404);

			story.approved = true;
			story.save()
				.success(function() {
					res.send(200);
				})
				.error(function() {
					res.send(500);
				});
		})
		.error(function() {
			res.send(404);
		});	
};

exports.remove = function(req, res) {
	Story.destroy({id: req.params.id})
		.success(function() {
			res.send(200);
		})
		.error(function() {
			res.send(404);
		});
};
