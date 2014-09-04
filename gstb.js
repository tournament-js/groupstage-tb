var GroupStage = require('groupstage');
var TieBreaker = require('tiebreaker');

function GroupStageTb(numPlayers, opts) {
  opts = GroupStageTb.defaults(numPlayers, opts);
  var invReason = GroupStageTb.invalid(numPlayers, opts);
  if (invReason !== null) {
    console.error("Invalid %d player GroupStageTb with opts=%j rejected",
      numPlayers, opts
    );
    throw new Error("Cannot construct GroupStageTb: " + invReason);
  }
  this.current = new GroupStage(numPlayers, opts); // make private
  this.limit = opts.limit;
  this.stage = 1;
  this.matches = []; // since this is a tourney - need to ask for this.active()
}


GroupStageTb.invalid = function (np, opts) {
  var o = GroupStageTb.defaults(np, opts);
  var invReason = GroupStage.invalid(np, o);
  if (invReason !== null) {
    return invReason;
  }
  var numGroups = Math.ceil(np / o.groupSize);
  if (o.limit <= 0) {
    return "need to specify a non-zero limit";
  }
  if (o.limit % numGroups !== 0) {
    return "number of groups must divide limit";
  }
  return null;
};
GroupStageTb.defaults = function (np, opts) {
  var o = GroupStage.defaults(np, opts);
  o.limit = opts.limit | 0; // can't really guess this - force users to think
  return o;
};


// proxy a few methods onto current
GroupStageTb.prototype.score = function (id, score) {
  return this.current.score(id, score);
};
GroupStageTb.prototype.unscorable = function (id, score, allowPast) {
  return this.current.unscorable(id, score, allowPast);
};
GroupStageTb.prototype.results = function () {
  return this.current.results();
};

// TODO: maybe freeze/unfreeze matches so only score modifies it
GroupStageTb.prototype.active = function () {
  return this.current.matches.slice(); // old-style matches
};

function Id(t, s, r, m) {
  this.t = t;
  this.s = s;
  this.r = r;
  this.m = m;
}
Id.prototype.toString = function () {
  return "T" + this.t + " G" + this.s + " R" + this.r + " M" + this.m;
};

var storeHistory = function (ms, extra, stage) {
  extra.forEach(function (m) {
    var copy = {
      id: new Id(stage, m.id.s, m.id.r, m.id.m),
      p: m.p.slice()
    };
    if (m.m) {
      copy.m = m.m.slice();
    }
    ms.push(m);
  });
};

GroupStageTb.prototype.isStageComplete = function () {
  return this.current.isDone();
};

GroupStageTb.prototype._mustPropagate = function () {
  return TieBreaker.isNecessary(this.current, this.limit);
};

GroupStageTb.prototype.propagate = function () {
  if (!this.isStageComplete() || !this._mustPropagate()) {
    return false;
  }
  // TODO: keep track of old instances and matches...
  var tb = TieBreaker.from(this.current, this.limit, { grouped: true });
  storeHistory(this.matches, this.current.matches, this.stage);
  this.current = tb;
  this.stage += 1;
  return true;
};

GroupStageTb.prototype.isDone = function () {
  return this.current.isDone() && !this._mustPropagate();
};

GroupStageTb.prototype.isTieBreakerRound = function () {
  return this.current.name === 'TieBreaker';
};

// TODO: ::upcoming (calculate to see if player needed in tiebreaker round)

GroupStageTb.prototype.results = function () {
  // just defer to groupstage or tiebreaker - both take care of this
  return this.current.results();
};

module.exports = GroupStageTb;
