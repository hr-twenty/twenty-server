var passport = require('passport'),
    LinkedInStrategy = require('passport-linkedin').Strategy;

module.exports = function(app, linkedin) {
  passport.use(new LinkedInStrategy({
    consumerKey: linkedin.apiKey,
    consumerSecret: linkedin.secretKey,
    callbackURL: linkedin.redirectUri
  }, function(token, tokenSecret, profile, done) {
    console.log('In passport strategy')
    process.nextTick(function() {
      return done(null, profile);
    });
  }));

  app.use(passport.initialize());
  app.use(passport.session());
};

