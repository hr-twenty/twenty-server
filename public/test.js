window.getUser = function(data){
  $.get('/user', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.postUser = function(data){
  $.post('/user', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.deleteUser = function(data){
  $.ajax({
    url: '/user',
    data: data,
    type: 'DELETE'
    })
  .done(function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.retrieveStack = function(data){
  $.get('/userStack', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.reject = function(data){
  $.post('/userStack/reject', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.approve = function(data){
  $.post('/userStack/approve', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.resetStack = function(data){
  $.post('/userStack/reset', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.sendMsg = function(data){
  $.post('/conversations/one', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.getAllMsg = function(data){
  $.get('/conversations/all', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

window.getOneMsg = function(data){
  $.get('/conversations/one', data, function(err, user){
    console.log(err)
    console.log(user)
  });
};

var userIds = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';

var generateUserId = function(){
  var result = '';
  for(var i = 0; i < 10; i++){
    var rand = Math.floor(Math.random()*userIds.length);
    result+= userIds.charAt(rand);
  }
  return result;
};

var firstNames = ['Rob', 'Ian', 'Wesley', 'Eric', 'Phillip', 'Addison', 'Shawn', 'Marcus', 'Doug'];
var lastNames = ['Holmes', 'Lyons', 'Mao', 'Craft', 'Alexander', 'Lee', 'Drost', 'Phillips', 'Calhoun'];
var locations = ['San Francisco Bay Area', 'Los Angeles', 'Chicago'];
var pictures = ['https://media.licdn.com/mpr/mpr/shrink_200_200/p/6/000/1bb/219/0c7f9dc.jpg', 'https://media.licdn.com/mpr/mpr/shrink_200_200/p/4/000/12c/25e/32d438e.jpg', 'https://media.licdn.com/mpr/mpr/shrink_200_200/p/6/000/1ea/073/01afa70.jpg', 'https://media.licdn.com/mpr/mpr/shrink_200_200/p/6/005/05a/2d1/11b15ba.jpg', 'https://media.licdn.com/mpr/mpr/shrink_200_200/p/1/000/26d/20e/0810afd.jpg'];
var industries = ['Software', 'Healthcare', 'Banana Stand', 'Education'];
var curPositions = ['Software Engineer', 'Brogrammer', 'Teacher', 'Shark rider', 'Janitor'];
var curCompanies = ['Hack Reactor', 'Google', 'Twitter', 'Yahoo', 'Ionic'];
var companySizes = ['1-49', '50-200', '201-1000', 'over 9000'];
var languages = ['English', 'French', 'Esperanto'];
var skills = ['Angular.js', 'Backbone.js', 'Ionic', 'Marketing', 'Biz dev', 'd3.js', 'Node.js', 'Javascript', 'HTML', 'CSS', 'MongoDB'];
var schools = ['Hack Reactor', 'USC', 'Harvard', 'Yale'];
var months = ['Apr', 'Jan', 'June', 'Dec', 'July', 'Feb'];
var years = ['2014', '1901', '1987', '2003', '1776', 'The Year 1', '2012'];
var fields = ['Economics', 'Computer Science', 'Babes', 'Booze'];

var opening = ['just', '', '', '', '', 'ask me how i', 'completely', 'nearly', 'productively', 'efficiently', 'last night i', 'the president', 'that wizard', 'a ninja', 'a seedy old man'];
var verbs = ['drank', 'drunk', 'deployed', 'got', 'developed', 'built', 'invented', 'experienced', 'fought off', 'hardened', 'enjoyed', 'developed', 'consumed', 'debunked', 'drugged', 'doped', 'made', 'wrote', 'saw'];
var objects = ['my', 'your', 'the', 'a', 'my', 'an entire', 'this', 'that', 'the', 'the big', 'a new form of'];
var nouns = ['cat', 'koolaid', 'system', 'city', 'worm', 'cloud', 'potato', 'money', 'way of life', 'belief system', 'security system', 'bad decision', 'future', 'life', 'pony', 'mind'];
var tags = ['#techlife', '#burningman', '#sf', 'but only i know how', 'for real', '#sxsw', '#ballin', '#omg', '#yolo', '#magic', '', '', '', ''];

var randomMessage = function(){
  return [randomElement(opening), randomElement(verbs), randomElement(objects), randomElement(nouns), randomElement(tags)].join(' ');
};

var randomElement = function(arr){
  return arr[Math.floor(Math.random()*arr.length)];
};

var numConnections = function(){
  return ''+Math.floor(Math.random()*600);
};

window.generateLotsaUsers = function(){

    data = {'educations': {
              'values': [
                {
                  'endDate': {'year': randomElement(years)},
                  'fieldOfStudy': randomElement(fields),
                  'schoolName': randomElement(schools),
                  'startDate': {'year': randomElement(years)}
                },{
                  'endDate': {'year': randomElement(years)},
                  'fieldOfStudy': randomElement(fields),
                  'schoolName': randomElement(schools),
                  'startDate': {'year': randomElement(years)}
                }
              ]
            },
            'firstName': randomElement(firstNames),
            'headline': randomMessage(),
            'id': generateUserId(),
            'industry': randomElement(industries),
            'lastName': randomElement(lastNames),
            'pictureUrl': randomElement(pictures),
            'location': {
              'country': {'code': 'us'},
              'name': randomElement(locations),
            },
            'numConnections': numConnections(),
            'positions': {
              'values': [
                {
                  'company': {
                    'name': randomElement(curCompanies),
                    'size': randomElement(companySizes),
                  },
                  'isCurrent': true,
                  'startDate': {
                    'month': randomElement(months),
                    'year': randomElement(years),
                  },
                  'title': randomElement(curPositions),
                },      {
                  'company': {
                    'name': randomElement(curCompanies),
                    'size': randomElement(companySizes),
                  },
                  'isCurrent': false,
                  'startDate': {
                    'month': randomElement(months),
                    'year': randomElement(years),
                  },'endDate': {
                    'month': randomElement(months),
                    'year': randomElement(years),
                  },
                  'title': randomElement(curPositions),
                },      {
                  'company': {
                    'name': randomElement(curCompanies),
                    'size': randomElement(companySizes),
                  },
                  'isCurrent': false,
                  'startDate': {
                    'month': randomElement(months),
                    'year': randomElement(years),
                  },'endDate': {
                    'month': randomElement(months),
                    'year': randomElement(years),
                  },
                  'title': randomElement(curPositions),
                },      {
                  'company': {
                    'name': randomElement(curCompanies),
                    'size': randomElement(companySizes),
                  },
                  'isCurrent': false,
                  'startDate': {
                    'month': randomElement(months),
                    'year': randomElement(years),
                  },'endDate': {
                    'month': randomElement(months),
                    'year': randomElement(years),
                  },
                  'title': randomElement(curPositions),
                }
              ]
            },
            'skills': {
              'values': [
                {
                  'skill': {'name': randomElement(skills)}
                }, {
                  'skill': {'name': randomElement(skills)}
                }, {
                  'skill': {'name': randomElement(skills)}
                }, {
                  'skill': {'name': randomElement(skills)}
                }, {
                  'skill': {'name': randomElement(skills)}
                }
              ]
            }
          };
    $.post('/user', data, function(err, user){
      console.log(err)
      console.log(user)
    });
};