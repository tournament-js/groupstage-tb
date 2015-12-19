# GroupStage-Tb
[![npm status](http://img.shields.io/npm/v/groupstage-tb.svg)](https://www.npmjs.org/package/groupstage-tb)
[![build status](https://secure.travis-ci.org/clux/groupstage-tb.svg)](http://travis-ci.org/clux/groupstage-tb)
[![dependency status](https://david-dm.org/clux/groupstage-tb.svg)](https://david-dm.org/clux/groupstage-tb)
[![coverage status](http://img.shields.io/coveralls/clux/groupstage-tb.svg)](https://coveralls.io/r/clux/groupstage-tb)

This module wraps [GroupStage](https://github.com/clux/groupstage) and [TieBreaker](https://github.com/clux/tiebreaker) in such a way that `TieBreaker` is invoked with as many rounds as is necessary to resolve ties (typically zero or one time). It is an implementation of [tourney](https://github.com/clux/tourney).

If you want to pick an exact number of players from a `GroupStage` to advance to a second stage in a `Tourney` this module (or something like it) is required. `GroupStage` does not provide much in way of resolving ties except from with the statistics it works out internally, but if the number of points and the sum of map scores (`.for` and `.against`) are all identical it needs help to break up for the next stage.

## Usage
Use like `GroupStage`, but set a `limit`:

```js
var GS = require('groupstage-tb');
var trn = new GS(6, { groupSize: 3, limit: 4 }); // want top 4 to proceed

// matches are equivalent to a normal GroupStage instance
trn.matches;
[ { id: Id { s: 1, r: 1, m: 1 }, p: [ 3, 6 ] },
  { id: Id { s: 1, r: 2, m: 1 }, p: [ 1, 6 ] },
  { id: Id { s: 1, r: 3, m: 1 }, p: [ 1, 3 ] },
  { id: Id { s: 2, r: 1, m: 1 }, p: [ 4, 5 ] },
  { id: Id { s: 2, r: 2, m: 1 }, p: [ 2, 5 ] },
  { id: Id { s: 2, r: 3, m: 1 }, p: [ 2, 4 ] } ]

// score it with ties
trn.matches.forEach(m => {
  if (m.id.s === 2) {
    trn.score(m.id, [1,1]); // tie group 2 completely
  }
  else {
    trn.score(m.id, m.p[0] < m.p[1] ? [1,0]: [0,1]); // everywhere else scored in seed order
  }
});

trn.stageDone(); // true
trn.isDone(); // false (cannot determine top 4 when one group is tied)
trn.createNextStage(); // true (forced to create another stage)

// new set of matches is the subset of matches needed to be played to break
// in this case we have to break an entire group, so it's a replay
trn.matches;
[ { id: Id { s: 2, r: 1, m: 1 }, p: [ 4, 5 ] },
  { id: Id { s: 2, r: 2, m: 1 }, p: [ 2, 5 ] },
  { id: Id { s: 2, r: 3, m: 1 }, p: [ 2, 4 ] } ]

trn.matches.forEach(m => {
  trn.score(m.id, m.p[0] < m.p[1] ? [1,0]: [0,1]); // score by seed
});

trn.stageDone(); // true - tiebreaker round over
trn.isDone(); // true - no further tiebreaking needed
trn.complete(); // true - can lock it down when isDone()

// Since we scored all matches by seeds (ultimately) - top 4 can be chosen unambiguously
trn.results().slice(0,4).map(r => r.seed);
[ 1, 2, 3, 4 ]
```

This module is here pretty much only here for the last step. If you tried this `slice` when just using `GroupStage` you could get 3 players from group one and 1 player from group two in the absence of sufficient information to split them up between groups. `Tournament.from` relies on the `results().slice` to select the people to pass through so this infomation must be as accurate as possible.

## Combination
Since this module is a [Tourney](https://github.com/clux/tourney), you can use it in other tourneys.

The canonical groupstage to duel tournament implementation, [groupstage-tb-duel](https://github.com/clux/groupstage-tb-duel) uses this module as the "first stage" (even though it can be more than one stage when tiebreaking kicks in), then pipes the winners to a [duel](https://github.com/clux/duel) `Tournament` - for almost all use cases, this is likely what you want.

If you have less conventional ideas about tournament structure, you could plumb this module into other things. The modularity is there.

## Installation
From npm:

```bash
$ npm install groupstage-tb
```

## License
MIT-Licensed. See LICENSE file for details.
