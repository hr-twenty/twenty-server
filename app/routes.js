/* global require */
var userHandlers = require('./userHandlers'),
    stackHandlers = require('./stackHandlers'),
    messageHandlers = require('./messageHandlers');

module.exports = function(app) {

  app.get('/user', userHandlers.getUserData);
  app.post('/user', userHandlers.createNewUser);
  app.put('/user', userHandlers.updateUser);
  app.del('/user', userHandlers.deleteUser);

  //UserStack
  app.post('/userStack/approve', stackHandlers.approve);
  app.post('/userStack/reject', stackHandlers.reject);
  app.get('/userStack', stackHandlers.getStack);

  //Messages
  app.get('/conversations/all', messageHandlers.getAllConversations);
  app.get('/conversations/one', messageHandlers.getOneConversation);
  app.post('/conversations/one', messageHandlers.sendMessage);

  // Sign in/out
  app.get('/login', function(req, res) {
    res.redirect('/auth/linkedin');
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // Catch all route
  app.get('/*', function(req, res) {
    console.log(' *** uncaught request', req.url);
    res.send(404);
  });

};

