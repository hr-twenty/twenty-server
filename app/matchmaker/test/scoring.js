var scoring = require('../lib/scoring')();

var expect = require('chai').expect;

describe('matching', function(){
  var me = {
    skills: {
      angular: 1,
      backbone: -1
    }
  }
  var myFormula = {
    skills: {
      angular: 1,
      backbone: 0
    }
  }
  var you ={
    skills: {
      angular: -1,
      backbone: 1
    }
  }
  var yourFormula = {
    skills: {
      angular: 1,
      backbone: 0
    }
  }
  it('should evaluate a score', function(){
    var score = scoring(me, myFormula, you, yourFormula)
    expect(isNaN(score)).to.equal(false)
  })
})