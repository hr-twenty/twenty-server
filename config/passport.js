var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

module.exports = function(app, passport, linkedin) {
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

  app.use(passport.initialize());
  app.use(passport.session());
};

