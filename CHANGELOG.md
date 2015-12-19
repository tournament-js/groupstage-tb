1.3.1 / 2015-12-20
==================
  * Documentation release

1.3.0 / 2015-12-15
==================
  * Also correctly bump tiebreaker and groupstage
  * Bump tourney to the correct minor

1.2.0 / 2015-12-15
==================
  * Bump tourney for configurable logs

1.1.0 / 2014-10-11
==================
  * Bump dependencies for serialization safe state management

1.0.0 / 2014-10-10
==================
  * Rewrite using tourney@1.0.0 - older version deprecated - see documentation
  * **Completely breaking update**
  * Stability bumped to unstable

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
