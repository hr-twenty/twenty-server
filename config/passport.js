var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
    linkedin = require('./linkedin'),
    User = require('../app/userModel');


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

    var user = JSON.parse(profile._raw);
    var queryParams = {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      headline: user.headline,
      picture: user.pictureUrl,
      numConnections: user.numConnections,
      locationCity: user.location.name,
      locationCountry: user.location.country.code,
      industryName: user.industry,
      curPositionTitle: user.positions.values[0].title,
      curCompanyName: user.positions.values[0].company.name,
      companySize: user.positions.values[0].company.size,
      languageName: '',
      skillName: '',
      schoolName: '',
      curCompanyStartDate: user.positions.values[0].startDate.month + '-' + user.positions.values[0].startDate.year,
      curCompanyEndDate: user.positions.values[0].isCurrent ? 'present' : user.positions.values[0].endDate.month + '-' + user.positions.values[0].endDate.year,
      languageProficiency: '',
      schoolFieldOfStudy: '',
      schoolStartDate: '',
      schoolEndDate: ''
    };

    console.log('profile');
    console.log(profile._raw);
    console.log('*********');
    User.get({ userId: profile.id }, function(err, finalResults) {
      if (finalResults.length === 0) {
        User.create(queryParams, function(err, finalResults) {
          console.log('User created...');
          console.log(err || finalResults);
        });
      } else {
        // update user
        console.log('user exists');
      }
    });

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
      res.redirect('http://localhost:3000/#/main/home/?userId=' + req.user.id);
    }
  );

};

