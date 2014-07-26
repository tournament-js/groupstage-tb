var GroupStage = require('groupstage');
var TieBreaker = require('tiebreaker');
var Tourney = require('tourney');

function GroupStageTb(numPlayers, opts) {
  opts = GroupStage.defaults(numPlayers, opts);
  var invReason = GroupStage.invalid(numPlayers, opts);
  if (invReason !== null) {
    console.error("Invalid %d player GroupStageTb with opts=%j rejected",
      numPlayers, opts
    );
    throw new Error("Cannot construct GroupStageTb: " + invReason);
  }
  var gs = new GroupStage(numPlayers, opts);
  this.limit = opts.limit;
  Tourney.call(this, [gs]);
}
GroupStageTb.idString = function (id) {
  return [id.t, id.s, id.r, id.m].join('-');
};
Tourney.inherit(GroupStageTb, Tourney);

/*
GroupStageTb.configure({
  defaults: function (np, opts) {
    opts = GroupStage.defaults(opts);
    // TODO: add own options on top?
    return opts;
  },
  invalid: function (np, opts) {
    var invReason = GroupStage.invalid(np, opts);
    if (invReason !== null) {
      return invReason;
    }
    // TODO: own rejection reasons here
    // TODO: reject if limit % numGroups !== 0
    // TODO: reject if no limit set
    return null;
  }
});*/

GroupStageTb.prototype._createNext = function () {
  var tb = TieBreaker.from(this._trns[0], this.limit, { grouped: true });

  if (tb.matches.length > 0) {
    return [tb]; // we needed to tiebreak :(
  }
  return [];
};

GroupStageTb.prototype.isDone = function () {
  return this._trns[0].isDone() && !TieBreaker.isNecessary(this._trns[0], this.limit);
};

GroupStageTb.prototype.isTieBreakerRound = function () {
  return this._trns[0].name === 'TieBreaker';
};


module.exports = GroupStageTb;
