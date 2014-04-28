module.exports = function(db){
  return {
    next: require('./lib/matching')(db),
    classify: require('./lib/classify')(db),
    score: require('./lib/scoring')()
  }
};

