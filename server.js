/*
 * server.js
 * Application entry point
 */

var express    = require('express');
var AWS        = require('aws-sdk');
var connection = require('./common/connection.js');
var api        = require('./routes/api');
var backend    = require('./routes/backend.js');
var auth       = require('./middleware/auth.js');
var app        = express();


// config
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.cookieSession({secret: '13efb221b41a061c9fe1018671e4aef4'}));
app.use(express.logger('dev'));
AWS.config.loadFromPath('./config/aws.json');

// routes
app.get('/api/stories/latest', auth.api, api.stories.latest);
app.get('/api/stories/:id', auth.api, api.stories.show);
app.post('/api/stories/submit', auth.api, api.stories.submit_url);
app.post('/api/stories/upload', auth.api, api.stories.submit_img);

app.get('/api/auth/request_token',  api.auth.request_token);
app.post('/api/auth/verify', api.auth.verify);
app.post('/api/auth/twitter', api.auth.twitter);
app.post('/api/auth/facebook', api.auth.facebook);

app.get('/dash', auth.dash, backend.dashboard);
app.put('/dash/:id', auth.dash, backend.approve);
app.delete('/dash/:id', auth.dash, backend.remove);

// start server
connection
	.authenticate()
	.success(function() {
		app.listen(app.get('port'));
		console.log('Application started on port', app.get('port'));
	})
	.error(function() {
		console.log('Could not connect to database');
	});
