var _ = require('lodash'),
    LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
    linkedin = require('./linkedin'),
    User = require('../app/userModel');


module.exports = function(app, passport, ip, port) {

  console.log('************', ip, port);
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

    console.log(profile._raw);
    var user = {
      id: 'Not Entered',
      firstName: 'Not Entered',
      lastName: 'Not Entered',
      headline: 'Not Entered',
      pictureUrl: 'Not Entered',
      numConnections: 'Not Entered',
      industry: 'Not Entered',
      location: {
        name: 'Not Entered',
        country: {
          code: 'Not Entered'
        }
      },
      positions: {
        values: [{
          title: 'Not Entered',
          company: {
            name: 'Not Entered',
            size: 'Not Entered'
          },
          startDate: {
            month: 'Not Entered',
            year: 'Not Entered'
          },
          isCurrent: 'Not Entered'
        }]
      },
      skills: {
        values: [{
          skill: { name: 'Not Entered' }
        }]
      },
      educations: {
        values: [{
          schoolName: 'Not Entered',
          fieldOfStudy: 'Not Entered',
          startDate: { year: 'Not Entered' },
          endDate: { year: 'Not Entered' }
        }]
      },
      languages: {
        values: [{
          language: { name: 'Not Entered' }
        }]
      }
    };

    _.merge(user, JSON.parse(profile._raw));

    User.get({ userId: profile.id }, function(err, finalResults) {
      if (finalResults.length === 0) {
        console.log(user.languages.values[0]);
        User.create(user, function(err) {
          console.log('User created...');
          console.log('err',err);
        });
      } else {
        // TODO: update user
        console.log('User found...');
        console.log(err || finalResults);
      }
    });

    process.nextTick(function() {
      return done(null, profile);
    });
  }));

};

