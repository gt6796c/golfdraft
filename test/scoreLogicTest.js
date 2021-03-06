var _ = require('lodash');
var constants = require('../common/constants');
var ScoreLogic = require('../js/logic/ScoreLogic');

var MISSED_CUT = constants.MISSED_CUT;

describe('ScoreLogic', function () {

  var draftPicks, scores;

  before(function() {
    draftPicks = [
      { pickNumber: 0, player: 'Player1', golfer: 'Golfer1_0' },
      { pickNumber: 1, player: 'Player1', golfer: 'Golfer1_1' },
      { pickNumber: 2, player: 'Player1', golfer: 'Golfer1_2' },
      { pickNumber: 3, player: 'Player1', golfer: 'Golfer1_3' }
    ];
    scores = {
      Golfer1_0: { golfer: 'Golfer1_0', day: 1, scores: [-1,  0,  0,  0] },
      Golfer1_1: { golfer: 'Golfer1_1', day: 1, scores: [-2,  0,  0,  0] },
      Golfer1_2: { golfer: 'Golfer1_2', day: 1, scores: [0,  -1,  0,  0] },
      Golfer1_3: { golfer: 'Golfer1_3', day: 1, scores: [0,  -3,  0,  0] },
    };

  });

  describe('calcPlayerScores for partial', function () {
    var startDay = 1, numDays = 1, perDay = 2;
    it('calculates scores for each day', function () {
      ScoreLogic.calcPlayerScores(draftPicks, scores, startDay, numDays, perDay).should.eql({
        Player1: {
          player: 'Player1',
          total: -4,
          pickNumber: 0,
          scoresByDay: { 1:
            {
              day: 1,
              allScores: [
                scores['Golfer1_3'],
                scores['Golfer1_2'],
                scores['Golfer1_0'],
                scores['Golfer1_1']
              ],
              usedScores: [scores['Golfer1_3'], scores['Golfer1_2']],
              total: -4
            }          },
          scoresByGolfer: {
            Golfer1_0: _.extend({ total: -1 }, scores['Golfer1_0']),
            Golfer1_1: _.extend({ total: -2 }, scores['Golfer1_1']),
            Golfer1_2: _.extend({ total: -1 }, scores['Golfer1_2']),
            Golfer1_3: _.extend({ total: -3 }, scores['Golfer1_3'])
          }
        }
      });
    });

  });

    it('calculates scores for each day', function () {
      var startDay = 0, numDays = 4, perDay = 2;
      ScoreLogic.calcPlayerScores(draftPicks, scores, startDay, numDays, perDay).should.eql({
        Player1: {
          player: 'Player1',
          total: -3 + -4,
          pickNumber: 0,
          scoresByDay: { 0:
            {
              day: 0,
              allScores: [
                scores['Golfer1_1'],
                scores['Golfer1_0'],
                scores['Golfer1_2'],
                scores['Golfer1_3']
              ],
              usedScores: [scores['Golfer1_1'], scores['Golfer1_0']],
              total: -3
            }, 1:
            {
              day: 1,
              allScores: [
                scores['Golfer1_3'],
                scores['Golfer1_2'],
                scores['Golfer1_0'],
                scores['Golfer1_1']
              ],
              usedScores: [scores['Golfer1_3'], scores['Golfer1_2']],
              total: -4
            }, 2:
            {
              day: 2,
              allScores: _.values(scores),
              usedScores: [scores['Golfer1_0'], scores['Golfer1_1']],
              total: 0
            },3:
            {
              day: 3,
              allScores: _.values(scores),
              usedScores: [scores['Golfer1_0'], scores['Golfer1_1']],
              total: 0
            }
          },
          scoresByGolfer: {
            Golfer1_0: _.extend({ total: -1 }, scores['Golfer1_0']),
            Golfer1_1: _.extend({ total: -2 }, scores['Golfer1_1']),
            Golfer1_2: _.extend({ total: -1 }, scores['Golfer1_2']),
            Golfer1_3: _.extend({ total: -3 }, scores['Golfer1_3'])
          }
        }
      });
    });

  describe('fillMissedCutScores', function () {

    it('replaces "MC" scores with the worst score for that day', function () {
      var startDay = 0, numDays = 4;
      ScoreLogic.fillMissedCutScores([
        { scores: [MISSED_CUT, 1, 0, 0] },
        { scores: [0, MISSED_CUT, 2, 0] },
        { scores: [0, 0, MISSED_CUT, 3] },
        { scores: [4, 0, 0, MISSED_CUT] }
      ],startDay, numDays)
      .should.eql([
        { scores: [4, 1, 0, 0], missedCuts: [true, false, false, false] },
        { scores: [0, 1, 2, 0], missedCuts: [false, true, false, false] },
        { scores: [0, 0, 2, 3], missedCuts: [false, false, true, false] },
        { scores: [4, 0, 0, 3], missedCuts: [false, false, false, true] },
      ]);
    });

  });

});
