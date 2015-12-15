var GsTb = require('..')
  , GS = require('groupstage')
  , gId = (g, r, m) => new GS.Id(g, r, m)
  , TB = require('tiebreaker')
  , tId = (s, r, m, simple) => new TB.Id(s, r, m, simple)
  , test = require('bandage');

test('invalid', function *(t) {
  var inv = GsTb.invalid;
  t.equal(inv(1), "numPlayers cannot be less than 2", "gs reason");
  t.equal(inv(4), "need to specify a non-zero limit", "1st limitation");
  t.equal(inv(8, { groupSize: 4, limit: 3}), "number of groups must divide limit",
    'limit must be sensible'
  );
});

test('sixteenFourLimitFour', function *(t) {
  var trn = new GsTb(16, { groupSize: 4, limit: 4 });
  t.ok(!trn.stageDone(), 'need to play first round');
  t.ok(trn.inGroupStage(), 'start out in groupstage');

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
  t.ok(!trn.inGroupStage(), 'thus no longer in GroupStage');


  var msTb = trn.matches;

  // no resolution at all in gs so tb is equivalent - except for Ids being TIds
  var expR2 = expR1.slice().map(m => {
    return { id: tId(m.id.s, m.id.r, m.id.m, false), p: m.p };
  });
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
  t.deepEqual(trn.players(), [1, 5, 12, 16], "group 1 remaining in second tb");
  t.deepEqual(trn.upcoming(1)[0].id, tId(1, 1, 1), "player 1 upcoming s3");
  t.deepEqual(trn.upcoming(5)[0].id, tId(1, 1, 2), "player 5 upcoming s3");

  msTb2.forEach(function (m) {
    // reduce num players for next
    trn.score(m.id, (m.id.m === 1) ? [1,1] : [1,0]);
  });

  t.deepEqual(trn.upcoming(5), [], "no information until next round");

  ensureMiddleBoundaries();
  t.ok(trn.inTieBreaker(), 'we should still be tied 3');

  t.deepEqual(trn.upcoming(1), [], "player one was knocked out of stage 3");
  t.deepEqual(trn.upcoming(5)[0].id, tId(1, 2, 1), "player 5 upcoming s4");

  var msTb3 = trn.matches;
  t.deepEqual(trn.players(), [5,12,16], '2nd placers in grp 1');


  msTb3.forEach(function (m) {
    trn.score(m.id, m.p[0] < m.p[1] ? [1,0] : [0,1]); // resolve rest
  });

  // ensure everthing done - no middle boundry check this time
  t.ok(trn.stageDone(), 'final stage complete');
  t.ok(trn.isDone(), "and tourney complete");

  t.ok(!trn.createNextStage(), "thus createNextStage fails");

  // so all players except G1 (1,5,12,16) are scored by rank
  // inject 1 in 4th placers (since was knocked out)
  // inject  then finally 5 is better than 12 is better than 16
  // so sort by seed as normal

  var res = trn.results();
  res.forEach(function (r) {
    // ignore clutter - all identical because everyone tied in GroupStage
    delete r.wins; // all 0
    delete r.draws; // all 3
    delete r.losses; // all 0
    delete r.for; // all 3
    delete r.against; // all 3
    delete r.pts; // all 3 (3x ties)
  });
  t.deepEqual(res, [
      { seed: 2, pos: 1, grp: 2, gpos: 1 },
      { seed: 3, pos: 1, grp: 3, gpos: 1 },
      { seed: 4, pos: 1, grp: 4, gpos: 1 },
      { seed: 5, pos: 1, grp: 1, gpos: 1 },
      { seed: 6, pos: 5, grp: 2, gpos: 2 },
      { seed: 7, pos: 5, grp: 3, gpos: 2 },
      { seed: 8, pos: 5, grp: 4, gpos: 2 },
      { seed: 12, pos: 5, grp: 1, gpos: 2 },
      { seed: 9, pos: 9, grp: 4, gpos: 3 },
      { seed: 10, pos: 9, grp: 3, gpos: 3 },
      { seed: 11, pos: 9, grp: 2, gpos: 3 },
      { seed: 16, pos: 9, grp: 1, gpos: 3 },
      { seed: 1, pos: 13, grp: 1, gpos: 4 },
      { seed: 13, pos: 13, grp: 4, gpos: 4 },
      { seed: 14, pos: 13, grp: 3, gpos: 4 },
      { seed: 15, pos: 13, grp: 2, gpos: 4 }
    ], 'results verification'
  );
});
