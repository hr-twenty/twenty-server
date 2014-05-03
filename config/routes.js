/* global require */
var messages = require('../app/controllers/messages'),
    stacks = require('../app/controllers/stacks'),
    users = require('../app/controllers/users');

module.exports = function(app, passport) {

  // app.use('/user', passport.authorize('linkedin', { failureRedirect: '/login' }))
  app.get('/user', users.show);
  app.post('/user', users.create);
  app.put('/user', users.update);
  app.del('/user', users.destroy);

  //UserStack
  // app.use('/userStack', passport.authorize('linkedin', { failureRedirect: '/login' }))
  app.post('/userStack/:action', stacks.create);
  app.get('/userStack', stacks.show);

  //Messages
  // app.use('/conversations', passport.authorize('linkedin', { failureRedirect: '/login' }))
  app.get('/conversations/all', messages.index);
  app.get('/conversations/one', messages.show);
  app.post('/conversations/one', messages.create);

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

