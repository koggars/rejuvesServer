/*
 * connection.js
 * Universal point of access to the application's Postgres database
 */

var Sequelize = require('sequelize');

var url = process.env.DATABASE_URL || 'postgres://root@localhost:5432/rejuves'
var connection = new Sequelize(url);

module.exports = connection;
