
var messages = require('../app/controllers/messages'),
    stacks = require('../app/controllers/stacks'),
    users = require('../app/controllers/users');

module.exports = function(app, passport) {

  // Messages
  // app.use('/messages', passport.authorize('linkedin', { failureRedirect: '/login' }))
  app.get('/messages', messages.index);
  app.post('/messages', messages.create);
  app.get('/messages/:id', messages.show);
  // app.put('/messages/:id', messages.update);
  // app.delete('/messages/:id', messages.destroy);

  // Stacks
  // app.use('/stacks', passport.authorize('linkedin', { failureRedirect: '/login' }))
  app.get('/stacks', stacks.index);
  app.post('/stacks', stacks.create);
  // app.get('/stacks/:id', stacks.show);
  // app.put('/stacks/:id', stacks.update);
  // app.delete('/stacks/:id', stacks.destroy);

  // Users
  // app.use('/users', passport.authorize('linkedin', { failureRedirect: '/login' }))
  app.get('/users', users.index);
  app.post('/users', users.create);
  // app.get('/users/:id', users.show);
  // app.put('/users/:id', users.update);
  app.delete('/users/:id', users.destroy);

  // Registration
  app.get('/login', function(req, res) {
    res.redirect('/auth/linkedin');
  });
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'keyboard cat' }));
  app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
    res.json(req.user);
  });

};

