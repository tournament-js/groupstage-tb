var GsTb = require(process.env.GSTB_COV ? '../gstb-cov.js' : '../')
  , GS = require('groupstage');

exports.sixteenFourForwarding = function (t) {
  var trn = new GsTb(16, { groupSize: 4, limit: 4 });
  t.ok(!trn.isStageComplete(), 'need to play first round');

  var ensureMiddleBoundaries = function () {
    t.ok(!trn.isDone(), "whole tournament not done");
    t.ok(trn.isStageComplete(), 'stage done');
    t.ok(trn.propagate(), "could create next stage");
    t.ok(!trn.isStageComplete(), 'need to play second round');
  };

  var msGs = trn.active();
  var expR1 = GS(16, { groupSize: 4 }).matches;
  t.deepEqual(msGs, expR1, "Stage 1 === orig GS");

  // score s.t. tiebreakers fully necessary
  msGs.forEach(function (m) {
    trn.score(m.id, [1, 1]);
  });

  ensureMiddleBoundaries();
  t.ok(trn.isTieBreakerRound(), 'we should be tied now 1');


  var msTb = trn.active();
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
  t.ok(trn.isTieBreakerRound(), 'we should still be tied 2');

  var msTb2 = trn.active()
  // know this is sufficient to verify it's a TB because 1st placers not present
  var expR3 = expR2.slice().filter(function (m) {
    return m.id.s === 1;
  });
  t.deepEqual(msTb2, expR3, "Stage 3 === Group 1 TB");
  t.equal(expR3.length, GS(4).matches.length, "length equivalent to a 4p GS");
  // TODO: bad use of this.current
  t.deepEqual(trn.current.players(), [1, 5, 12, 16], "4 players left");
  t.deepEqual(trn.upcoming(1), { t: 3, s: 1, r: 1, m: 1 }, "player 1 upcoming s3");
  t.deepEqual(trn.upcoming(5), { t: 3, s: 1, r: 1, m: 2 }, "player 5 upcoming s3");

  msTb2.forEach(function (m) {
    // reduce num players for next
    trn.score(m.id, (m.id.m === 1) ? [1,1] : [1,0]);
  });

  t.equal(trn.upcoming(5), undefined, "no information until next round");

  ensureMiddleBoundaries();
  t.ok(trn.isTieBreakerRound(), 'we should still be tied 3');

  t.equal(trn.upcoming(1), undefined, "player one was knocked out of stage 3");
  t.deepEqual(trn.upcoming(5), { t: 4, s: 1, r: 2, m: 1 }, "player 5 upcoming s4");

  var msTb3 = trn.active();
  // TODO: use of this.current should not be needed - although this is helpful:
  t.deepEqual(trn.current.players(), [5,12,16], '2nd placers in grp 1');


  msTb3.forEach(function (m) {
    trn.score(m.id, m.p[0] < m.p[1] ? [1,0] : [0,1]); // resolve rest
  });

  // ensure everthing done - no middle boundry check this time
  t.ok(trn.isStageComplete(), 'final stage complete');
  t.ok(trn.isDone(), "and tourney complete");
  
  t.ok(!trn.propagate(), "thus propagate fails");

  t.done();
};
