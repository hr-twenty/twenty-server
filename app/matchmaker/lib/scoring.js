/*
  this formula will be calculated on schedule
  based on the day's accepts a user gives out

  forumla: {
    skills: {
      angularjs: 10,
      backbonejs: 3,
      yeomon: -6
    },
    ...
  }
*/
var scoring = function(me, you, formula, clusterMod){
  var total = 0;
  for (var type in formula){
    if (typeof me[type] === 'object'){
      total += scoring(me[type], you[type], formula[type], clusterMod)
    } else {
      var sign = you[type] ? 1 : -1;
      if (criteria === 'clusterMod'){
        sign = clusterMod;
      }
      total += sign * formula[type];
    }
  }
  return total;
};

module.exports = function(){
  return function(me, myFormula, you, yourFormula, clusterMod){
    return 
      scoring(me, you, myFormula, clusterMod) + 
      scoring(you, me, yourFormula, clusterMod);
  };
}
