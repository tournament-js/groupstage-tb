var GroupStage = require('groupstage');
var TieBreaker = require('tiebreaker');
var Tourney = require('tourney');

var GsTb = Tourney.sub('GroupStage-Tb', function (opts, init) {
  init(new GroupStage(this.numPlayers, opts));
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
      return 'need to specify a non-zero limit';
    }
    var numGroups = Math.ceil(np / opts.groupSize);
    if (opts.limit % numGroups !== 0) {
      return 'number of groups must divide limit';
    }
    return null;
  }
});

// ------------------------------------------------------------------
// Stage identifiers
// ------------------------------------------------------------------

GsTb.prototype.inGroupStage = function () {
  return this.getName(1) === 'GroupStage';
};

GsTb.prototype.inTieBreaker = function () {
  return this.getName(1) === 'TieBreaker';
};

// ------------------------------------------------------------------
// Expected methods
// ------------------------------------------------------------------

GsTb.prototype._mustPropagate = function (stg, inst, opts) {
  return TieBreaker.isNecessary(inst, opts.limit);
};

GsTb.prototype._createNext = function (stg, inst, opts) {
  // TODO: push opts.log onto options passed to Tb
  // inst is GroupStage or TieBreaker but solution is always the same:
  return TieBreaker.from(inst, opts.limit, { grouped: true });
};

GsTb.prototype._proxyRes = function () {
  return true; // can always proxy results to current - TieBreaker feature
};

// ------------------------------------------------------------------

module.exports = GsTb;
