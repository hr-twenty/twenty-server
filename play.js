var neo4j = require("neo4j");
var db = new neo4j.GraphDatabase(
  'http://localhost:7474'
);

var node = db.createNode({hello: 'world'});    
node.save(function (err, node) {   
  if (err) {
    console.error('Error saving new node to database:', err);
  } else {
    console.log('Node saved to database with id:', node.id);
  }
});