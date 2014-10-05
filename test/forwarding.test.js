var GsTb = require(process.env.GSTB_COV ? '../gstb-cov.js' : '../')
  , GS = require('groupstage');

exports.invalid = function (t) {
  var inv = GsTb.invalid;
  t.equal(inv(1), "numPlayers cannot be less than 2", "gs reason");
  t.equal(inv(4), "need to specify a non-zero limit", "1st limitation");
  t.equal(inv(8, { groupSize: 4, limit: 3}), "number of groups must divide limit",
    'limit must be sensible'
  );
  t.done();
};
exports.sixteenFourLimitFour = function (t) {
  var trn = new GsTb(16, { groupSize: 4, limit: 4 });
  t.ok(!trn.stageDone(), 'need to play first round');

  var ensureMiddleBoundaries = function () {
    t.ok(!trn.isDone(), "whole tournament not done");
    t.ok(trn.stageDone(), 'stage done');
    t.ok(trn.createNextStage(), "could create next stage");
    t.ok(!trn.stageDone(), 'need to play second round');
  };

  var msGs = trn.matches;
  var expR1 = GS(16, { groupSize: 4 }).matches;
  t.deepEqual(msGs, expR1, "Stage 1 === orig GS");

  // score s.t. tiebreakers fully necessary
  msGs.forEach(function (m) {
    trn.score(m.id, [1, 1]);
  });

  ensureMiddleBoundaries();
  t.ok(trn.inTieBreaker(), 'we should be tied now 1');


  var msTb = trn.matches;
  var expR2 = expR1.slice(); // no resolution at all in gs so tb is equivalent
  t.deepEqual(msTb, expR2, "Stage 2 === orig GS in TB form");

  msTb.forEach(function (m) {
    if (m.id.s === 1) {
      // keep tieing group 1
      trn.score(m.id, [1,1]);
    }
    else {
      trn.score(m.id, m.p[0] < m.p[1] ? [1,0] : [0,1]);
    }
  });

  ensureMiddleBoundaries();
  t.ok(trn.inTieBreaker(), 'we should still be tied 2');

  var msTb2 = trn.matches;
  // know this is sufficient to verify it's a TB because 1st placers not present
  var expR3 = expR2.slice().filter(function (m) {
    return m.id.s === 1;
  });
  t.deepEqual(msTb2, expR3, "Stage 3 === Group 1 TB");
  t.equal(expR3.length, GS(4).matches.length, "length equivalent to a 4p GS");
  t.deepEqual(trn.players(), [1, 5, 12, 16], "4 players left");
  t.deepEqual(trn.upcoming(1)[0].id, { s: 1, r: 1, m: 1 }, "player 1 upcoming s3");
  t.deepEqual(trn.upcoming(5)[0].id, { s: 1, r: 1, m: 2 }, "player 5 upcoming s3");

  msTb2.forEach(function (m) {
    // reduce num players for next
    trn.score(m.id, (m.id.m === 1) ? [1,1] : [1,0]);
  });

  t.deepEqual(trn.upcoming(5), [], "no information until next round");

  ensureMiddleBoundaries();
  t.ok(trn.inTieBreaker(), 'we should still be tied 3');

  t.deepEqual(trn.upcoming(1), [], "player one was knocked out of stage 3");
  t.deepEqual(trn.upcoming(5)[0].id, { s: 1, r: 2, m: 1 }, "player 5 upcoming s4");

  var msTb3 = trn.matches;
  t.deepEqual(trn.players(), [5,12,16], '2nd placers in grp 1');


  msTb3.forEach(function (m) {
    trn.score(m.id, m.p[0] < m.p[1] ? [1,0] : [0,1]); // resolve rest
  });

  // ensure everthing done - no middle boundry check this time
  t.ok(trn.stageDone(), 'final stage complete');
  t.ok(trn.isDone(), "and tourney complete");
  
  t.ok(!trn.createNextStage(), "thus createNextStage fails");

  t.done();
};
