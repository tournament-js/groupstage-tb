# Groupstage-Tb
[![npm status](http://img.shields.io/npm/v/groupstage-tb.svg)](https://www.npmjs.org/package/groupstage-tb)
[![build status](https://secure.travis-ci.org/clux/groupstage-tb.svg)](http://travis-ci.org/clux/groupstage-tb)
[![dependency status](https://david-dm.org/clux/groupstage-tb.svg)](https://david-dm.org/clux/groupstage-tb)
[![coverage status](http://img.shields.io/coveralls/clux/groupstage-tb.svg)](https://coveralls.io/r/clux/groupstage-tb)
[![unstable](http://img.shields.io/badge/stability-unstable-E5AE13.svg)](http://nodejs.org/api/documentation.html#documentation_stability_index)

An implementation of [tourney](https://github.com/clux/tourney). This module is basically [GroupStage](https://github.com/clux/groupstage) combined with as many [TieBreaker](https://github.com/clux/tiebreaker) rounds as is necessary to resolve ties.

In other words this module tiebreaks, and only makes sense to use over `GroupStage` if you know exactly how many players to progress to another tournament.

## Usage
Use like `GroupStage`, but set `limit`

```js
var GS = require('groupstage-tb');
var trn = new GS(16, { groupSize: 4, limit: 4 });
// score trn.matches until trn.stageDone()
while (!trn.isDone()) {
  // trn will automatically tiebreak for us so we can pick group winner in each group
  trn.createNextStage();
  // keep scoring trn.matches (now tiebreakers) until trn.stageDone()
}
trn.complete(); // seal
```

## Installation
Install locally from npm:

```bash
$ npm install groupstage-tb --save
```

## Running tests
Install development dependencies

```bash
$ npm install
```

Run the tests

```bash
$ npm test
```

## License
MIT-Licensed. See LICENSE file for details.
