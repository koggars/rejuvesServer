/*
 * redisConnection.js
 * Universal point of access to the application's redis database
 */
if (process.env.REDIS_URL) {
	//Example - redis://172.17.0.18:6379
	
	var redisString = process.env.REDIS_URL;
	var port = redisString.substr(redisString.lastIndexOf(":")+1);
	var hostname = redisString.substring(redisString.lastIndexOf("/")+1, redisString.lastIndexOf(":"));

	var redis = require("redis").createClient(port, hostname);

} else {
	var redis = require("redis").createClient();
}

module.exports = redis;