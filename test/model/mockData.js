var _ = require('lodash');
var data = [{
  userId: '1',
  locationCity:'San Francisco', 
  skillName: 'Angular.JS',
},{
  userId: '2',
  locationCity:'San Francisco', 
  skillName: 'Angular.JS',
},{
  userId: '3',
  locationCity:'San Francisco', 
  skillName: 'Ionic',
},{
  userId: '4',
  locationCity:'Not San Francisco', 
  skillName: 'Angular.JS',
}]

var commons = [{
  userId: '1',
  firstName:'Shane', 
  lastName:'Keller', 
  headline:'booya grandma!', 
  picture:'url', 
  numConnections:4, 
  locationCity:'San Francisco', 
  locationCountry:'USA',
  industryName: 'Software',
  curPositionTitle: 'Software Engineer',
  curCompanyName: 'Hack Reactor',
  curCompanyStartDate: '4-1-2014',
  curCompanyEndDate: 'Present',
  companySize: '1-49',
  languageName: 'English',
  languageProficiency: 'Native speaker',
  skillName: 'Angular.JS',
  schoolName: 'USC',
  schoolFieldOfStudy: 'Economics',
  schoolStartDate: '8-1-2005',
  schoolEndDate: '5-1-2010'
}]

module.exports = function(){
  var result = [];
  data.forEach(function(value){
    result.push(_.merge(commons, value));
  })
  return result;
}