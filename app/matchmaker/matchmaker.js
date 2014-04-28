module.exports = function(db){
  return {
    next: require('./lib/matching')(db),
    score: require('./lib/scoring')()
  }
};

