var Promise 		= require("bluebird");
var assert = require("assert"); // node.js core module
var controllers = require(process.env.PWD+'/app/controllers');

require(process.env.PWD+'/test/TestAuthentification');

require(process.env.PWD+'/test/TestMailFactory');

require(process.env.PWD+'/test/TestTransactionManager');