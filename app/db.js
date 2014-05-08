var neo4j = require('neo4j');
var conString = require('../config/env')(process.env.NODE_ENV || 'development').databaseUri;
var db = new neo4j.GraphDatabase(conString);

module.exports = db;