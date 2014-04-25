var neo4j = require("neo4j");
var db = new neo4j.GraphDatabase(
  'http://twenty:r5JqrtqFkkK1AtzxkOyc@twenty.sb01.stations.graphenedb.com:24789'
);

var node = db.createNode({hello: 'world'});    
node.save(function (err, node) {   
  if (err) {
    console.error('Error saving new node to database:', err);
  } else {
    console.log('Node saved to database with id:', node.id);
  }
  db.getNodeById(node.id, function(err, out){
    console.log(out.id, out.self, out.exists, out.toJSON());
  })
});
