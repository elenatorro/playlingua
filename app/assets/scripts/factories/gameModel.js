'use strict';
angular.module('PlaylinguaApp')
.factory('Game', ['$http', '$q', function($http, $q) {
    function Game(data) {
      this.exercises = data.exercises;
      this.exercises.forEach(function(exercise) {
        exercise = exercise[0];
      })
      var self = this;

      self.setExercises = function(exercises) {
        self.exercises = exercises;
      };

      self.getExercises = function() {
        return self.exercises;
      };

      self.getExercise = function(name) {
        return _.where(self.exercises, {name: name});
      };

      self.getTotalExerciseScore = function(exercise) {
        var totalScore = 0;
        var auxExercise;
        if (!exercise.levels) {
          auxExercise = exercise[0];
        } else {
          auxExercise = exercise;
        }
        auxExercise.levels.forEach(function(level) {
          totalScore += level.totalScore;
        })
        return totalScore;
      };


      self.isExercises = function() {
        return (self.exercises.length!=0);
      }

      self.createLevels = function(name) {
        $http.post('/createlevels/' + name).success(function(data) {
        }).error(function(data) {
        })
      };

      self.getProgress = function(exercise, level) {
        if (self.isExercises()) {
        var findExercise =  _.findWhere(self.exercises, {'name':exercise});
          if (findExercise.levels[level]) {
            return findExercise.levels[level].totalScore;
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

      self.getTrophyTitle = function(exercise) {
        var score = self.getTotalExerciseScore(self.getExercise(exercise));
        for (var points in self.trophyTitles) {
          if ((score >= (parseInt(points) - 25)) && (score < (parseInt(points) + 25))) {
            return self.trophyTitles[points];
            break;
            }
          }
        return self.trophyTitles[300];
      };

      self.getStarsNumber = function() {
        var stars = 0;
        self.exercises.forEach(function(exercise) {
          exercise.levels.forEach(function(level) {
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
