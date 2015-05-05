'use strict';
angular.module('PlaylinguaApp').factory('Excercises', 
  ['$resource', '$http', '$q', function($resource, $http, $q) {
    function Excercises(data) {
      angular.extend(this, data);
      var self = this;
      console.log(self);
      self.excercises.forEach(function(excercise) {
         excercise.totalScore = excercise.levels[0].totalScore + excercise.levels[1].totalScore + excercise.levels[2].totalScore;
      })
    };

    var resourceExcercises = $resource(
      '/excercises/:username',
      {},
      {
        'get':{
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          transformResponse: function(response){
            return new Excercises({excercises: JSON.parse(response)});
          }
        }
      });

    angular.extend(Excercises, resourceExcercises);

    return Excercises;
}]);
