var _ = require('lodash');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var linkedin = require('./linkedin');
var User = require('../app/models/users/');


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
      pictureUrl: 'http://s.c.lnkd.licdn.com/scds/common/u/img/themes/katy/ghosts/profiles/ghost_profile_65x65_v1.png',
      numConnections: 'Not Entered',
      industry: 'Not Entered'
    };

    _.merge(user, JSON.parse(profile._raw));

    User.get({ userId: profile.id }, function(err, finalResults) {
      if (err) throw err;
      if (finalResults.length === 0) {
        User.create(user, function(err) {
          if (err) throw err;
          console.log('User created...');
        });
      } else {
        // TODO: update user
        console.log('User found...');
      }
    });

    process.nextTick(function() {
      return done(null, profile);
    });
  }));

};

