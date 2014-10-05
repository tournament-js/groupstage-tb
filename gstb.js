var GroupStage = require('groupstage');
var TieBreaker = require('tiebreaker');
var Tourney = require('tourney');

var GsTb = Tourney.sub('GroupStage-Tb', function (opts, initParent) {
  this.limit = opts.limit;
  initParent(new GroupStage(this.numPlayers, opts));
});

GsTb.configure({
  defaults: function (np, opts) {
    opts.limit = opts.limit | 0;
    return opts;
  },
  invalid: function (np, opts) {
    var invReason = GroupStage.invalid(np, opts);
    if (invReason !== null) {
      return invReason;
    }
    if (opts.limit <= 0) {
      return "need to specify a non-zero limit";
    }
    var numGroups = Math.ceil(np / opts.groupSize);
    if (opts.limit % numGroups !== 0) {
      return "number of groups must divide limit";
    }
    return null;
  }
});

//------------------------------------------------------------------
// Stage identifiers
//------------------------------------------------------------------

GsTb.prototype.inGroupStage = function () {
  return this._inst.name === 'GroupStage';
};

GsTb.prototype.inTieBreaker = function () {
  return this._inst.name === 'TieBreaker';
};

//------------------------------------------------------------------
// Expected methods
//------------------------------------------------------------------

GsTb.prototype._mustPropagate = function () {
  return TieBreaker.isNecessary(this._inst, this.limit);
};

GsTb.prototype._createNext = function () {
  // inst is GroupStage or TieBreaker but solution is always the same:
  return TieBreaker.from(this._inst, this.limit, { grouped: true });
};

//------------------------------------------------------------------
// Overrides
//------------------------------------------------------------------

GsTb.prototype.results = function () {
  // Simpler than Tourney's - TieBreaker already does that work
  return this._inst.results();
};

//------------------------------------------------------------------

module.exports = GsTb;
