'use strict';
angular.module('PlaylinguaApp').factory('User', ['$resource', '$http', '$q', function($resource, $http, $q){
    function User(data) {
        angular.extend(this, data);
        var self = this;


        self.getUsername = function() {
          return self.username;
        };

        self.addLevelTo = function(exercise) {
          var level = {
            lastScore   : 0,
            maxScore    : 0,
            timesPlayed : 0
          };


        }
    };

    var resourceUser = $resource(
      '/user',
      {},
      {
        'get':{
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          transformResponse: function(response){
            var jsData = angular.fromJson(response);
            return new User(jsData);
          }
        }
      });

    angular.extend(User, resourceUser);

    return User;
}]);
