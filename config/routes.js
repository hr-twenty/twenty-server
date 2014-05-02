
var cards = require('../controllers/cards'),
    messages = require('../controllers/messages'),
    users = require('../controllers/users');

module.exports = function(app, passport) {

  // Cards
  app.get('/cards', cards.index);
  app.post('/cards', cards.create);
  app.get('/cards/:id', cards.show);
  app.put('/cards/:id', cards.update);
  app.delete('/cards/:id', cards.destroy);

  // Messages
  app.get('/messages', messages.index);
  app.post('/messages', messages.create);
  app.get('/messages/:id', messages.show);
  app.put('/messages/:id', messages.update);
  app.delete('/messages/:id', messages.destroy);

  // Users
  app.get('/users', users.index);
  app.post('/users', users.create);
  app.get('/users/:id', users.show);
  app.put('/users/:id', users.update);
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
