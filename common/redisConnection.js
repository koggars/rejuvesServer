/*
 * redisConnection.js
 * Universal point of access to the application's redis database
 */
if (process.env.REDIS_URL) {
	//Example - redis://172.17.0.18:6379
	console.log(process.env.REDIS_URL+ "\n");


	var redisString = process.env.REDIS_URL;
	var port = redisString.substr(redisString.lastIndexOf(":")+1);
	var hostname = redisString.substring(redisString.lastIndexOf("/")+1, redisString.lastIndexOf(":"));

	console.log(port+ "\n");
	console.log(hostname + "\n");
	var redis = require("redis");
	var client = redis.createClient(port, hostname);

} else {
	var redis = require("redis")
	var client = redis.createClient();
}

module.exports = client;
