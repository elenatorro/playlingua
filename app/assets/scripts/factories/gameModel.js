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
      }

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
        return self.tropyTitles(points);
      };

      // self.excercisesData = [
      //   {
      //     name: 'Sinónimos',
      //     url: 'synonyms',
      //     image: "../assets/icons/polaroids.png",
      //     levels: [
      //       {
      //         number: 1,
      //         title: 'Nivel 1',
      //         image: '../assets/icons/unicycle.png',
      //         progress: self.getProgress('sinonimos',0)
      //         // passed: self.isGold('sinonimos',0)
      //       },{
      //         number: 2,
      //         title: 'Nivel 2',
      //         image: '../assets/icons/bike.png',
      //         progress: self.getProgress('sinonimos',1)
      //         // passed: self.isGold('sinonimos',1)
      //
      //       },{
      //         number: 3,
      //         title: 'Nivel 3',
      //         image: '../assets/icons/motorcycle.png',
      //         progress: self.getProgress('sinonimos',2)
      //         // passed: self.isGold('sinonimos',2)
      //       }
      //     ]
      //   },{
      //     name: 'Definiciones',
      //     url: 'definitions',
      //     image: "../assets/icons/bookshelf.png",
      //     levels: [
      //       {
      //         number: 1,
      //         title: 'Nivel 1',
      //         image: '../assets/icons/plane.png',
      //         progress: self.getProgress('definiciones',0)
      //         // passed: self.isGold('definiciones',0)
      //       },{
      //         number: 2,
      //         title: 'Nivel 2',
      //         image: '../assets/icons/rocket.png',
      //         progress: self.getProgress('definiciones',1)
      //         // passed: self.isGold('definiciones',0)
      //       },{
      //         number: 3,
      //         title: 'Nivel 3',
      //         image: '../assets/icons/spaceshuttle.png',
      //         progress: self.getProgress('definiciones',2)
      //         // passed: self.isGold('definiciones',0)
      //       }
      //     ]
      //   }
      // ]
    };

    return Game;
}]);
