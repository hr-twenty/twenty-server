/* global require, module */
var userHandlers = require('./userHandlers');
var stackHandlers = require('./stackHandlers');
var messageHandlers = require('./messageHandlers');

module.exports = function(app) {

//Users
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

  app.route('/*')
  .get(function(req, res) {
    res.send(404);
  });

};

