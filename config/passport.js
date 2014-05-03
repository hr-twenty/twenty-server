
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
    linkedin = require('./linkedin'),
    User = require('../app/models/users');


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

    User.getById({ id: profile.id })
    .then(function(users) {
      if (users.length > 0) {
        User.update(profile._raw)
        .then(function(users) {
          console.log('User updated...');
        })
        .catch(function(err) {
          console.error(err);
        })
      } else {
        User.create(profile._raw)
        .then(function(data) {
          console.log('User created...');
        })
        .catch(function(err) {
          console.error(err);
        });
      }
    })
    .catch(function(err) {
      console.error(err);
    });

    process.nextTick(function() {
      return done(null, profile);
    });
  }));

};

