/*
 * aws.js
 * Shared AWS-SDK object
 */

var AWS = require('aws-sdk');
AWS.config.loadFromPath('../config/aws.json');

modules.export = AWS;
