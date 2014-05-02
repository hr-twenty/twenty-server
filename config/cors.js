module.exports =  function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, X-Requested-With');
  res.header('Access-Control-Max-Age', 10); // Seconds.
  res.header('Content-Type', 'application/json');
  next();
};

