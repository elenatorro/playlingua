'use strict';
angular.module('PlaylinguaApp').factory('Exercises',
  ['$resource', '$http', '$q', function($resource, $http, $q) {
    function Exercises(data) {
      angular.extend(this, data);
      var self = this;
      self.exercises.forEach(function(exercise) {
         exercise.totalScore = exercise.levels[0].totalScore + exercise.levels[1].totalScore + exercise.levels[2].totalScore;
      })
    };

    var resourceExercises = $resource(
      '/exercises/:username',
      {},
      {
        'get':{
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          transformResponse: function(response){
            return new Exercises({exercises: JSON.parse(response)});
          }
        }
      });

    angular.extend(Exercises, resourceExercises);

    return Exercises;
}]);
