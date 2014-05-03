/* global require */
var messages = require('../app/controllers/messages'),
    stacks = require('../app/controllers/stacks'),
    users = require('../app/controllers/users');

module.exports = function(app, passport) {

  // app.use('/user', passport.authorize('linkedin', { failureRedirect: '/login' }))
  app.get('/user', users.getUserData);
  app.post('/user', users.createNewUser);
  app.put('/user', users.updateUser);
  app.del('/user', users.deleteUser);

  //UserStack
  // app.use('/userStack', passport.authorize('linkedin', { failureRedirect: '/login' }))
  app.post('/userStack/approve', stacks.approve);
  app.post('/userStack/reject', stacks.reject);
  app.post('/userStack/reset', stacks.resetStack);
  app.get('/userStack', stacks.getStack);

  //Messages
  // app.use('/conversations', passport.authorize('linkedin', { failureRedirect: '/login' }))
  app.get('/conversations/all', messages.getAllConversations);
  app.get('/conversations/one', messages.getOneConversation);
  app.post('/conversations/one', messages.sendMessage);

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
      // TODO: don't hardcode address
      // only works in testing on chrome; doesn't work on mobile devices
      res.redirect('http://localhost:3000/#/loading?userId=' + req.user.id);
    }
  );

  // Catch all route
  app.get('/*', function(req, res) {
    console.log(' *** uncaught request at %s ***', req.url);
    res.send(404);
  });

};

