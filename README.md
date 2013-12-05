# Groupstage-Dynamic
[![Build Status](https://secure.travis-ci.org/clux/groupstage-dynamic.png)](http://travis-ci.org/clux/groupstage-dynamic)
[![Dependency Status](https://david-dm.org/clux/groupstage-dynamic.png)](https://david-dm.org/clux/groupstage-dynamic)
[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://nodejs.org/api/documentation.html#documentation_stability_index)

An implementation of [dynamic-tournament](https://github.com/clux/dynamic-tournament). This module is basically [GroupStage](https://github.com/clux/groupstage) combined with as many [TieBreaker](https://github.com/clux/tiebreaker) rounds as is necessary to resolve ties.

In other words this module tiebreaks, and only makes sense to use over `GroupStage` if you know exactly how many players to progress to another tournament.


## Installation
Install locally from npm:

```bash
$ npm install groupstage-dynamic --save
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
