var GsTb = require('../')
  , GS = require('groupstage')
  , test = require('tap').test;

test("forwarding 16 4", function (t) {
  var trn = new GsTb(16, { groupSize: 4, limit: 4 });
  t.ok(!trn.stageComplete(), 'need to play first round');

  var ensureMiddleBoundaries = function (round) {
    t.ok(!trn.isDone(), "whole tournament not done");
    t.ok(round.isDone(), "round complete");
    t.ok(trn.stageComplete(), 'can start next stage now');
    t.ok(trn.createNextStage(), "could create next stage");
    t.ok(!trn.stageComplete(), 'need to play second round');
    t.ok(!trn.currentRound().isDone(), "next round incomplete");
  };

  var gs = trn.currentRound();
  var expR1 = GS(16, { groupSize: 4 }).matches;
  t.deepEqual(gs.matches, expR1, "Stage 1 === orig GS");

  // score s.t. tiebreakers necessary
  gs.matches.forEach(function (m, i) {
    gs.score(m.id, [1, 1]);
  });

  ensureMiddleBoundaries(gs);

  var tb = trn.currentRound();
  var expR2 = expR1.slice(); // no resolution at all in gs so tb is equivalent
  t.deepEqual(tb.matches, expR2, "Stage 2 === orig GS in TB form");


  tb.matches.forEach(function (m) {
    if (m.id.s === 1) {
      // keep tieing group 1
      tb.score(m.id, [1,1]);
    }
    else {
      tb.score(m.id, m.p[0] < m.p[1] ? [1,0] : [0,1]);
    }
  });
  ensureMiddleBoundaries(tb);


  var tb2 = trn.currentRound();
  // know this is sufficient to verify it's a TB because 1st placers not present
  var expR3 = expR2.slice().filter(function (m) {
    return m.id.s === 1;
  });
  t.deepEqual(tb2.matches, expR3, "Stage 3 === Group 1 TB");
  t.equal(expR3.length, GS(4).matches.length, "length equivalent to a 4p GS");
  t.equal(tb2.players().length, 4, "4 players left");


  tb2.matches.forEach(function (m) {
    // reduce num players for next
    tb2.score(m.id, (m.id.m === 1) ? [1,1] : [1,0]);
  });

  ensureMiddleBoundaries(tb2);


  var tb3 = trn.currentRound();
  t.deepEqual(tb3.players(), [5,12,16], '2nd placers in grp 1');

  tb3.matches.forEach(function (m) {
    tb3.score(m.id, m.p[0] < m.p[1] ? [1,0] : [0,1]); // resolve rest
  });

  // ensure everthing done - no middle boundry check this time
  t.ok(tb3.isDone(), "round complete");
  t.ok(trn.stageComplete(), 'can start next stage now');
  t.ok(!trn.createNextStage(), "could not create any more stages now");
  t.ok(trn.isDone(), 'the whole tournament is done');

  t.end();
});
