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
var locations = ['San Francisco', 'Los Angeles', 'Chicago'];
var pictures = ['https://media.licdn.com/mpr/mpr/shrink_200_200/p/6/000/1bb/219/0c7f9dc.jpg', 'https://media.licdn.com/mpr/mpr/shrink_200_200/p/4/000/12c/25e/32d438e.jpg', 'https://media.licdn.com/mpr/mpr/shrink_200_200/p/6/000/1ea/073/01afa70.jpg', 'https://media.licdn.com/mpr/mpr/shrink_200_200/p/6/005/05a/2d1/11b15ba.jpg', 'https://media.licdn.com/mpr/mpr/shrink_200_200/p/1/000/26d/20e/0810afd.jpg'];
var industries = ['Software', 'Healthcare', 'Banana Stand', 'Education'];
var curPositions = ['Software Engineer', 'Brogrammer', 'Teacher', 'Shark rider', 'Janitor'];
var curCompanies = ['Hack Reactor', 'Google', 'Twitter', 'Yahoo', 'Ionic'];
var companySizes = ['1-49', '50-200', '201-1000', 'over 9000'];
var languages = ['English', 'French', 'Esperanto'];
var skills = ['Angular.js', 'Backbone.js', 'Ionic', 'Marketing', 'Biz dev'];
var schools = ['Hack Reactor', 'USC', 'Harvard', 'Yale'];
var dates = ['Apr 20, 2014', 'Jan 1, 1901', 'June 26, 1987', 'Dec 25, 2003', 'July 4, 1776', 'The Year 1', 'Feb 29, 2012'];
var proficiences = ['n00b', 'dungeon master', 'Native Speaker', 'Best there eva was'];
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

  var i = 0;

  while(i < 500){
    data = {
      userId: generateUserId(),
      firstName: randomElement(firstNames),
      lastName: randomElement(lastNames),
      headline: randomMessage(),
      picture: randomElement(pictures),
      numConnections: numConnections(),
      locationCity: randomElement(locations),
      locationCountry: 'us',
      industryName: randomElement(industries),
      curPositionTitle: randomElement(curPositions),
      curCompanyName: randomElement(curCompanies),
      curCompanyStartDate: randomElement(dates),
      curCompanyEndDate: 'present',
      companySize: randomElement(companySizes),
      languageName: randomElement(languages),
      languageProficiency: randomElement(proficiences),
      skillName: randomElement(skills),
      schoolName: randomElement(schools),
      schoolFieldOfStudy: randomElement(fields),
      schoolStartDate: randomElement(dates),
      schoolEndDate: randomElement(dates)
    };
    i++;
    $.post('/user', data, function(err, user){
      console.log(err)
      console.log(user)
    });
  }
};