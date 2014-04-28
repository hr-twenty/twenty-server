module.exports =  function(req, res, next){
  res.headers = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': '*',
    'access-control-max-age': 10, // Seconds.
    'Content-Type': 'application/json'
  };
  console.log('hit cors!')
  next();
};

