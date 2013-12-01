var GroupStage = require('groupstage');
var TieBreaker = require('tiebreaker');
var Dynamic = require('dynamic-tournament');

function DynamicGroupStage(numPlayers, opts) {
  this.numPlayers = numPlayers;
  opts = GroupStage.defaults(numPlayers, opts);
  var invReason = GroupStage.invalid(numPlayers, opts);
  if (invReason !== null) {
    console.error("Invalid %d player DynamicGroupStage with opts=%j rejected",
      numPlayers, opts
    );
    throw new Error("Cannot construct DynamicGroupStage: " + invReason);
  }
  var gs = new GroupStage(this.numPlayers, opts);
  this.limit = opts.limit;
  Dynamic.call(this, gs);
}
//DynamicGroupStage.idString = function (id) {
//  return [id.t, id.s, id.r, id.m].join('-');
//};
Dynamic.inherit(DynamicGroupStage, Dynamic);

/*
DynamicGroupStage.configure({
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

DynamicGroupStage.prototype._createNext = function () {
  var tb = TieBreaker.from(this._trn, this.limit, { grouped: true });

  if (tb.matches.length > 0) {
    return tb; // we needed to tiebreak :(
  }
  return null;
};

DynamicGroupStage.prototype.isDone = function () {
  return this._trn.isDone() && !TieBreaker.isNecessary(this._trn, this.limit);
};


module.exports = DynamicGroupStage;
