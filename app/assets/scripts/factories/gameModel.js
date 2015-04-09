'use strict';
angular.module('PlaylinguaApp')
.factory('Game', function() {
    function Game(game) {
      angular.extend(this, game);
      var self = this;

      self.getProgress = function(excercise, level) {
        if (self.excercises[excercise].levels[level]) {
          return self.excercises[excercise].levels[level].maxScore
        } else {
          return 0;
        }
      }

      self.isPassed = function(excercise, level) {
        if (self.excercises[excercise].levels[level]) {
          return (self.excercises[excercise].levels[level].maxScore >= 70)
        } else {
          return false;
        }
      };

      self.getStars = function() {

      };


      self.trophyTitles = {
        60  : 'Principiante',
        70  : 'Aspirante',
        75  : 'Novato',
        80  : 'Intermedio',
        85  : 'Avanzado',
        90  : 'Experto',
        95  : 'Pro',
        100 : 'Supremo'
      };

      self.getTrophy = function() {

      };

      self.excercisesData = [
        {
          name: 'Sinónimos',
          url: 'synonyms',
          image: "../assets/icons/polaroids.png",
          levels: [
            {
              number: 1,
              title: 'Nivel 1',
              image: '../assets/icons/unicycle.png',
              progress: self.getProgress(0,0),
              passed: self.isPassed(0,0)
            },{
              number: 2,
              title: 'Nivel 2',
              image: '../assets/icons/bike.png',
              progress: self.getProgress(0,1),
              passed: self.isPassed(0,1)

            },{
              number: 3,
              title: 'Nivel 3',
              image: '../assets/icons/motorcycle.png',
              progress: self.getProgress(0,2),
              passed: self.isPassed(0,2)
            }
          ]
        },{
          name: 'Definiciones',
          url: 'definitions',
          image: "../assets/icons/bookshelf.png",
          levels: [
            {
              number: 1,
              title: 'Nivel 1',
              image: '../assets/icons/plane.png',
              progress: self.getProgress(1,0),
              passed: self.isPassed(0,0)
            },{
              number: 2,
              title: 'Nivel 2',
              image: '../assets/icons/rocket.png',
              progress: self.getProgress(1,1),
              passed: self.isPassed(0,0)
            },{
              number: 3,
              title: 'Nivel 3',
              image: '../assets/icons/spaceshuttle.png',
              progress: self.getProgress(1,2),
              passed: self.isPassed(0,0)
            }
          ]
        }
      ]
    };

    return Game;
});
