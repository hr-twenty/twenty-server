var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://twenty:32sWAeLkd1sBjy9yeB0v@twenty.sb01.stations.graphenedb.com:24789');

module.exports = db;