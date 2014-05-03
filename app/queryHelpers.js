/* global exports */

/*--------Query Helper Methods-----------*/
exports.positionQuery = function(user){
  if(user.positions){
    var finalResult = '';
    var isCurrentPos = function(p){
      if(p.isCurrent === 'true' || p.isCurrent === true){return 'ROLE_IS';} 
      else {return 'ROLE_WAS';}
    };
    var isCurrentCo = function(p){
      if(p.isCurrent === 'true' || p.isCurrent === true){return 'WORKS_FOR';} 
      else {return 'WORKED_FOR';}
    };
    var isCurrentDate = function(p){
      console.log('isCurrentDate', p)
      if(p.isCurrent === 'true' || p.isCurrent === true){
        console.log('true', p.isCurrent);
        return 'Present';}
      else {
        console.log('false', p.endDate);
        return p.endDate.year;}
    };
    user.positions.values.forEach(function(p){
      finalResult += 'MERGE (position:Position {title:"'+p.title+'"}) '+
      'CREATE UNIQUE (user)-[:'+isCurrentPos(p)+']->(position) '+
      'WITH user '+
      'MERGE (company:Company {name:"'+p.company.name+'"}) '+
      'MERGE (companySize:CompanySize {size:"'+(p.company.size || 'Not Entered')+'"}) '+
      'CREATE UNIQUE (company) -[:HAS_CO_SIZE]-> (companySize) '+
      'CREATE UNIQUE (user) -[:'+isCurrentCo(p)+' {startDate:"'+p.startDate.month+'-'+p.startDate.year+'", endDate:"'+isCurrentDate(p)+'"}]-> (company) '+
      'WITH user ';
    });
    return finalResult;
  }
};

exports.languageQuery = function(user){
  if(user.languages){
    var finalResult = '';
    user.languages.values.forEach(function(l){
      finalResult += 'MERGE (language:Language {name:"'+l.language.name+'"}) '+
      'CREATE UNIQUE (user) -[:SPEAKS]-> (language) '+
      'WITH user ';
    });
    return finalResult;
  }
};

exports.skillQuery = function(user){
  if(user.skills){
    var finalResult = '';
    user.skills.values.forEach(function(s){
      finalResult += 'MERGE (skill:Skill {skill:"'+s.skill.name+'"}) '+
      'CREATE UNIQUE (user) -[:HAS_SKILL]-> (skill) '+
      'WITH user ';
    });
    return finalResult;
  }
};

exports.schoolQuery = function(user){
  if(user.educations){
    var startYearOrNA = function(s){
      if(s.startDate){return s.startDate.year;}
      else {return 'Not Entered';}
    };
    var endYearOrNA = function(s){
      if(s.endDate){return s.endDate.year;}
      else {return 'Not Entered';}
    };
    var finalResult = '';
    user.educations.values.forEach(function(s){
      finalResult += 'MERGE (school:School {name:"'+s.schoolName+'"}) '+
      'CREATE UNIQUE (user) -[:ATTENDED {fieldOfStudy:"'+(s.fieldOfStudy || '')+'", startDate:"'+startYearOrNA(s)+'",endDate:"'+endYearOrNA(s)+'"}]-> (school) '+
      'WITH user ';
    });
    return finalResult;
  }
};
