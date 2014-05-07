var neo4j = require('neo4j');
var conString = require('../config/env').databaseUri;
console.log('`````````````` db con', conString);
var db = new neo4j.GraphDatabase(conString);

module.exports = db;