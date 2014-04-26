module.exports = function(app) {

  //profile and settings


  //matching


  //messaging


  //uncaught
  app.get('/*', function(req, res) {
    console.log(' *** uncaught request', req.url);
    res.send(404);
  });
};

