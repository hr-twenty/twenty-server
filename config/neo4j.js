
var neo4j = require('neo4j'),
    env = require('../env')(process.env.NODE_ENV),
    db = new neo4j.GraphDatabase(env.databaseUri);

module.exports = db;

