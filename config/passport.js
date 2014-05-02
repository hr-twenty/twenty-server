var _ = require('lodash'),
    LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
    linkedin = require('./linkedin'),
    User = require('../app/userModel');


module.exports = function(app, passport, ip, port) {

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
    callbackURL: 'http://' + ip + ':' + port + linkedin.redirectUri,
    scope: [ 'r_fullprofile' ],
    profileFields: [
      'id',
      'first-name',
      'last-name',
      'headline',
      'location:(name,country:(code))',
      'industry',
      'num-connections',
      'positions',
      'picture-url',
      'languages',
      'skills',
      'educations'
    ]
  }, function(req, accessToken, refreshToken, profile, done) {

    var user = {
      id: 'Not Entered',
      firstName: 'Not Entered',
      lastName: 'Not Entered',
      headline: 'Not Entered',
      pictureUrl: 'Not Entered',
      numConnections: 'Not Entered',
      industry: 'Not Entered'
    };

    _.merge(user, JSON.parse(profile._raw));

    User.get({ userId: profile.id }, function(err, finalResults) {
      if (finalResults.length === 0) {
        User.create(user, function(err) {
          console.log('User created...');
          console.log('err',err);
        });
      } else {
        // TODO: update user
        console.log('User updated...');
      }
    });

    process.nextTick(function() {
      return done(null, profile);
    });
  }));

};

