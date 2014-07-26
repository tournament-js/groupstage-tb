var GsTb = require(process.env.GSTB_COV ? '../gstb-cov.js' : '../')
  , GS = require('groupstage')

exports.forwardingSixteen = function (t) {
  var d = new GsTb(16, { groupSize: 4, limit: 4 });
  t.ok(!d.stageComplete(), 'need to play first round');

  var ensureMiddleBoundaries = function (d) {
    t.ok(d.stageComplete(), 'can start next stage now');
    t.ok(!d.isDone(), "dynamic GroupStage not complete");
    t.ok(d.createNextStage(), "could create next stage");
    t.ok(!d.stageComplete(), 'need to play second round');
  };

  //var expR1 = GS(16, { groupSize: 4 }).matches.map(function (m) {
  //  m.id.t = 1;
  //  m.id.p = 1; // all stages have one parallel segment each
  //  return m;
  //});
  //t.deepEqual(d.currentStage(), expR1, "Stage 1 === orig GS");

  // score s.t. tiebreakers necessary
  var stage = d.currentStage()[0];
  stage.matches.forEach(function (m, i) {
    stage.score(m.id, [1, 1]);
  });

  ensureMiddleBoundaries(d);
  t.ok(d.isTieBreakerRound(), 'we should be tied now');
  t.done();
  return;

  var expR2 = expR1.map(function (m) {
    m.id.t += 1; // we didn't resolve anything with the GroupStage..
    m.id.p = 1;
    return m;
  })
  t.deepEqual(d.currentStage(), expR2, "Stage 2 === orig GS in TB form");

  d.currentStage()[0].forEach(function (m) {
    if (m.id.s === 1) {
      // keep tieing group 1
      d.score(m.id, [1,1]);
    }
    else {
      d.score(m.id, m.p[0] < m.p[1] ? [1,0] : [0,1]);
    }
  });
  ensureMiddleBoundaries(d);
  t.ok(d.isTieBreakerRound(), 'we should still be tied');

  // know this is sufficient to verify it's a TB because 1st placers not present
  var expR3 = expR2.filter(function (m) {
    return m.id.s === 1;
  }).map(function (m) {
    m.id.t += 1;
    m.id.p = 1
    return m;
  });
  t.deepEqual(d.currentStage(), expR3, "Stage 3 === Group 1 TB");
  t.equal(expR3.length, GS(4).matches.length, "length equivalent to a 4p GS");
  //t.equal(d.currentPlayers().length, 4, "4 players left");

  d.currentStage().forEach(function (m) {
    // reduce num players for next
    d.score(m.id, (m.id.m === 1) ? [1,1] : [1,0]);
  });

  ensureMiddleBoundaries(d);

  //t.deepEqual(d.currentPlayers(), [5,12,16], '2nd placers in grp 1');

  d.currentStage().forEach(function (m) {
    d.score(m.id, m.p[0] < m.p[1] ? [1,0] : [0,1]); // resolve rest
  });

  // ensure everthing done
  t.ok(d.stageComplete(), "final group stage complete");
  t.ok(d.isDone(), "dynamic group stage complete");
  t.ok(!d.createNextStage(), "can't create more stages");

  t.done();
};
