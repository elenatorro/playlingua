'use strict';
angular.module('PlaylinguaApp').factory('Level', ['$resource', '$http', '$q', function($resource, $http, $q){
    function Level(data) {
        angular.extend(this, data);
        var self = this;

        self.getContent = function() {
          return self.content;
        };

        self.lifes = new Array(5);
    };

    var resourceLevel = $resource(
      '/synonym/level/:levelnumber',
      {},
      {
        'get':{
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          transformResponse: function(response){
            var jsData = angular.fromJson(response);
            return new Level(jsData);
          }
        }
      });

    angular.extend(Level, resourceLevel);

    return Level;
}]);
