# Groupstage-Tb
[![Build Status](https://secure.travis-ci.org/clux/groupstage-tb.png)](http://travis-ci.org/clux/groupstage-tb)
[![Dependency Status](https://david-dm.org/clux/groupstage-tb.png)](https://david-dm.org/clux/groupstage-tb)
[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://nodejs.org/api/documentation.html#documentation_stability_index)

An implementation of [tourney](https://github.com/clux/tourney). This module is basically [GroupStage](https://github.com/clux/groupstage) combined with as many [TieBreaker](https://github.com/clux/tiebreaker) rounds as is necessary to resolve ties.

In other words this module tiebreaks, and only makes sense to use over `GroupStage` if you know exactly how many players to progress to another tournament.

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
