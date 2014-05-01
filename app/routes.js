/* global require */
var userHandlers = require('./userHandlers'),
    stackHandlers = require('./stackHandlers'),
    messageHandlers = require('./messageHandlers');

module.exports = function(app, passport) {

  app.use('/user', passport.authorize('linkedin', { failureRedirect: '/login' }))
  app.get('/user', userHandlers.getUserData);
  app.post('/user', userHandlers.createNewUser);
  app.put('/user', userHandlers.updateUser);
  app.del('/user', userHandlers.deleteUser);

  //UserStack
  app.use('/userStack', passport.authorize('linkedin', { failureRedirect: '/login' }))
  app.post('/userStack/approve', stackHandlers.approve);
  app.post('/userStack/reject', stackHandlers.reject);
  app.post('/userStack/reset', stackHandlers.resetStack);
  app.get('/userStack', stackHandlers.getStack);

  //Messages
  app.use('/conversations', passport.authorize('linkedin', { failureRedirect: '/login' }))
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

  // Passport-linkedin routes
  app.get('/auth/linkedin',
    passport.authenticate('linkedin', { state: 'keyboard cat' })
  );

  app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/#/main/home/?userId=' + req.user.id);
    }
  );

  // Catch all route
  app.get('/*', function(req, res) {
    console.log(' *** uncaught request', req.url);
    res.send(404);
  });

};

