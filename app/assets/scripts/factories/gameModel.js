'use strict';
angular.module('PlaylinguaApp')
.factory('Game', ['$http', '$q', function($http, $q) {
    function Game(data) {
      this.excercises = data.excercises;
      this.excercises.forEach(function(excercise) {
        excercise = excercise[0];
      })
      var self = this;

      self.setExcercises = function(excercises) {
        self.excercises = excercises;
      };

      self.getExcercises = function() {
        return self.excercises;
      };

      self.getExcercise = function(name) {
        return _.where(self.excercises, {name: name});
      };

      self.getTotalExcerciseScore = function(excercise) {
        var totalScore = 0;
        excercise[0].levels.forEach(function(level) {
          totalScore += level.totalScore;
        })
        return totalScore;
      };

      self.isExcercises = function() {
        return (self.excercises.length!=0);
      }

      self.createLevels = function(name) {
        $http.post('/createlevels/' + name).success(function(data) {
        }).error(function(data) {
        })
      };

      self.getProgress = function(excercise, level) {
        if (self.isExcercises()) {
        var findExcercise =  _.findWhere(self.excercises, {'name':excercise});
          if (findExcercise.levels[level]) {
            return findExcercise.levels[level].totalScore;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      };

      self.trophyTitles = {
        25   : 'Principiante',
        50   : 'Aspirante',
        75   : 'Novato',
        100  : 'Aprendiz',
        125  : 'Intermedio',
        150  : 'Avanzado',
        175  : 'Profesional',
        200  : 'Máquina',
        225  : 'Experto',
        250  : 'Pro',
        275  : 'Supremo',
        300  : 'Súper Estrella'
      };

      self.getTrophy = function(points) {
        return self.trophyTitles[points];
      };

      self.getTrophyTitle = function(excercise) {
        var score = self.getTotalExcerciseScore(self.getExcercise(excercise));
        for (var points in self.trophyTitles) {
          if ((score >= (parseInt(points))) && (score < (parseInt(points) + 25))) {
            return self.trophyTitles[points];
            break;
            }
          }
        return self.trophyTitles[25];
      };

      self.getStarsNumber = function() {
        var stars = 0;
        self.excercises.forEach(function(excercise) {
          excercise.levels.forEach(function(level) {
            if (level.totalScore >= 100) stars++;
          })
        })
        return stars;
      };

      self.stars = new Array(self.getStarsNumber());


      self.getProgress = function(score) {
        if (score > 100) return 100;
        else return score;
      }
    };

    return Game;
}]);
