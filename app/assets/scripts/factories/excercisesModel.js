'use strict';
angular.module('PlaylinguaApp').factory('Excercises', ['$resource', '$http', '$q', function($resource, $http, $q){
    function Excercises(data) {
        angular.extend(this, data);
        console.log(data);
        var self = this;
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
