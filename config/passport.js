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
    callbackURL: 'http://' + ip + ":" + port + linkedin.redirectUri,
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
      id: 'nil',
      firstName: 'nil',
      lastName: 'nil',
      headline: 'nil',
      pictureUrl: 'nil',
      numConnections: 'nil',
      industry: 'nil',
      location: {
        name: 'nil',
        country: {
          code: 'nil'
        }
      },
      positions: {
        values: [{
          title: 'nil',
          company: {
            name: 'nil',
            size: 'nil'
          },
          startDate: {
            month: 'nil',
            year: 'nil'
          },
          isCurrent: 'nil'
        }]
      },
      skills: {
        values: [{
          skill: { name: 'nil' }
        }]
      },
      educations: {
        values: [{
          schoolName: 'nil',
          fieldOfStudy: 'nil',
          startDate: { year: 'nil' },
          endDate: { year: 'nil' }
        }]
      },
      languages: {
        values: [{
          language: { name: 'nil' }
        }]
      }
    };

    _.merge(user, JSON.parse(profile._raw));
    var queryParams = {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      headline: user.headline,
      picture: user.pictureUrl,
      numConnections: user.numConnections,
      industryName: user.industry,

      languageName: user.languages.values.map(function(obj) {
        return obj.language.name;
      }),
      languageProficiency: 'nil', // Currently don't have any information on how to populate

      skillName: user.skills.values.map(function(obj) {
        return obj.skill.name;
      }),

      schoolName: user.educations.values[0].schoolName,
      schoolFieldOfStudy: user.educations.values[0].fieldOfStudy,
      schoolStartDate: user.educations.values[0].startDate.year,
      schoolEndDate: user.educations.values[0].endDate.year,

      locationCity: user.location.name,
      locationCountry: user.location.country.code,

      curPositionTitle: user.positions.values[0].title,
      curCompanyName: user.positions.values[0].company.name,
      companySize: user.positions.values[0].company.size,
      curCompanyStartDate: user.positions.values[0].startDate.month + '-' + user.positions.values[0].startDate.year,
      curCompanyEndDate: user.positions.values[0].isCurrent ? 'present' : user.positions.values[0].endDate.month + '-' + user.positions.values[0].endDate.year
    };

    User.get({ userId: profile.id }, function(err, finalResults) {
      if (finalResults.length === 0) {
        User.create(queryParams, function(err, finalResults) {
          console.log('User created...');
          console.log(err || finalResults);
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

