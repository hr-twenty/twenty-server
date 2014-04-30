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
  }, function(req, accessToken, refreshToken, profile, done) {

    var user = JSON.parse(profile._raw);
    var queryParams = {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      headline: user.headline,
      picture: user.pictureUrl || '',
      numConnections: user.numConnections,
      locationCity: user.location.name,
      locationCountry: user.location.country.code,
      industryName: user.industry,
      curPositionTitle: '',
      curCompanyName: '',
      companySize: '',
      languageName: '',
      skillName: '',
      schoolName: '',
      curCompanyStartDate: '',
      curCompanyEndDate: '',
      languageProficiency: '',
      schoolFieldOfStudy: '',
      schoolStartDate: '',
      schoolEndDate: ''
    };

    User.get({ userId: profile.id }, function(err, finalResults) {
      if (err) {
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
      res.redirect('/user?userId=' + req.user.id);
    }
  );

};

