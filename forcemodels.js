var admin = require('./models/admin.js');
admin.sync({force:true});
var like = require('./models/like.js');
like.sync({force:true});
var story = require('./models/story.js');
story.sync({force:true});
var user = require('./models/user.js');
user.sync({force:true});

var Admin = require('./models/admin.js');

var bcrypt = require('bcrypt');
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash("whiteecho", "whitehashecho", function(err, hash) {
       bcrypt.compare("whiteecho", hash, function(err, res) {
		    console.log(res);
		});
    });
});