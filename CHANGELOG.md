0.3.0 / 2014-09-04
==================
  * Documentation and coverage
  * `.invalid` now verifies that `limit` option is set and divides
  * `stageComplete` renamed to `isStageComplete`
  * **Big breaking change**: no longer giving out tournament instances:
    - trn.active() give current match array
    - trn.matches refer to played matches and cannot be modified
    - trn.score, trn.unscorable, trn.results now proxies correctly onto unterlying tournament
  * Temporarily removed reliance on `tourney` while that is struggling with a purpose

0.2.1 / 2014-03-23
==================
  * updated to work with new tourney
  * now works sensibly

0.1.0 / 2013-11-XX
==================
  * initial test version