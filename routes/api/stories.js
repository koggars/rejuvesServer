/*
 * stories.js
 * Stories API endpoints
 */

var Story   = require('../../models/story.js');
var Like    = require('../../models/like.js');
var Embedly = require('../../common/embedly.js');
var AWS     = require('aws-sdk');
var fs      = require('fs');

var embedly = new Embedly('4726b93570e940ce9b3b1ce097160964');

function uploadFile(story, file) {
	var s3 = new AWS.S3();

	fs.readFile(file.path, function(err, data) {
		if (err) return console.log(err);

		s3.putObject({
			ACL: 'public-read',
			Bucket: 'rejuves',
			Key: 'uploads/' + story.id + '.jpg',
			Body: data
		}, function(err, res) {
			if (err) return console.log(err);

			story.imgUrl = 'https://s3-ap-northeast-1.amazonaws.com/rejuves/uploads/' + story.id + '.jpg';
			story.save();
		});
	});
}

/*
 * Get latest stories with optional count and
 * id offset
 */
exports.latest = function(req, res) {
	var query = {approved: true};

	if (req.query['before_id'])
		query.id = {lt: req.query['before_id']};

	Story
		.findAll({
			where: query,
			limit: req.query.count || 10,
			order: 'id DESC',
			attributes: ['id', 'title', 'imgUrl', 'webUrl']})
		.success(function(stories) {
			res.send(200, {code: 200, count: stories.length, data: stories});
		})
		.error(function() {
			res.send(500, {code: 500, error: 'Internal error'});
		});
};

/*
 * Get the content for a single story along with the user's like status
 */
exports.show = function(req, res) {
	Story.find(req.params.id)
		.success(function(story) {
			if (!story)
				res.send(404, {code: 404, error: 'Not found'});

			Like.count({StoryId:story.id})
				.success(function(count) {
					Like.find({UserId:req.user_id})
						.success(function(like) {
							var meta = {
								user_liked: !!like,
								likes: count
							};

							res.send(200, {code: 200, meta: meta,  data: story});
						});
				});
		});
};

/*
 * Submit a story by URL
 */
exports.submit_url = function(req, res) {
	if (!req.body.url)
		res.send(400, {code: 400, error: 'Bad request'});

	embedly.extract({url: req.body['url']}, function(err, response, body) {
		if (err || response.statusCode != 200)
			return res.send(500, {code: 500, error: 'Internal error'});

		var imgUrl = '';
		
		if (body.images.length > 0)
			imgUrl = body.images[0].url;

		Story.create({
			title: body.title,
			content: body.description,
			webUrl: body.url,
			imgUrl: imgUrl,
			UserId: req.user_id,
			approved: false
		})
		.success(function() {
			res.send(201, {code: 201, message: 'Awaiting approval'});
		})
		.error(function() {
			res.send(400, {code: 400, error: 'Bad request'});
		});
	});
};


/*
 * Submit an image
 */
exports.submit_img = function(req, res) {
	if (!req.body.caption || !req.files.image)
		return res.send(400, {code: 400, message: 'Bad Request'});

	Story.create({
		title: req.body.caption,
	 	upload: true,
		approved: false,
	})
	.success(function(story) {
		uploadFile(story, req.files.image);
		res.send(201, {code: 201, message: 'Created'});
	})
	.error(function() {
		res.send(500, {code: 500, message: 'Internal error'});
	});
};
