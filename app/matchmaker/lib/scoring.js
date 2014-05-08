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
var scoring = function (you, formula) {
  var total = 0;
  for (var type in formula ) {
    if (typeof you[type] === 'object') {
      total += scoring(you[type], formula[type]);
    } else {
      total += (you[type] ? 1 : -1) * formula[type];
    }
  }
  return total;
};

module.exports = function () {
  return function (me, myFormula, you, yourFormula) {
    return scoring(you, myFormula) + scoring(me, yourFormula);
  };
};
