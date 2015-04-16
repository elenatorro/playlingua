'use strict';
angular.module('PlaylinguaApp').factory('Level', ['$resource', '$http', '$q', function($resource, $http, $q){
    function Level(data) {
        angular.extend(this, data);
        var self = this;

        self.getContent = function() {
          return self.content;
        };

        self.lifes = 5;

        self.updateScore = function(score) {
          $http.put('/save/' + self.name + '/' + self.level + '/' + score)
          .success(function(data) {
            console.log('OK');
          })
          .error(function(data) {
            console.log(data);
            console.log('error');
          })
        };

        self.animal = _.sample(['lion','elephant','cok','castor', 'chicken', 'cow',
          'dog','donkey','duck','monkey','penguin','pig','puppy','seal','zebra']);
    };

    var resourceLevel = $resource(
      '/sinonimos/level/:levelnumber',
      {},
      {
        'get':{
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          transformResponse: function(response){
            var jsData = angular.fromJson(response);
            console.log(jsData);
            delete jsData.excercises[0]._id;
            return new Level(jsData.excercises[0]);
          }
        }
      });

    angular.extend(Level, resourceLevel);

    return Level;
}]);
