var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
    linkedin = require('./linkedin');


module.exports = function(app, passport) {

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new LinkedInStrategy({
    clientID: linkedin.apiKey,
    clientSecret: linkedin.secretKey,
    callbackURL: linkedin.redirectUri,
    passReqToCallback: true
  }, function(req, accessToken, refreshToken, profile, done) {
    req.session.accessToken = accessToken;
    process.nextTick(function() {
      return done(null, profile);
    });
  }));

  app.get('/auth/linkedin',
    passport.authenticate('linkedin', { state: 'keyboard cat' })
  );

  app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/api/user');
    }
  );

};

