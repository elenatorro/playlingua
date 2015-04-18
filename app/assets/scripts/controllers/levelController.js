angular.module('PlaylinguaApp')
.controller('levelController', [
  '$scope', "$http", "$routeParams","User", "Level",
  function($scope, $http, $routeParams, User, Level) {
    console.log($routeParams);
    Level.get({'name': $routeParams.name, 'levelnumber': $routeParams.level}).$promise.then(function(level) {
      $scope.contentArray = _.sample(level.elements, 3);
      $scope.level = level;
      console.log(level);
      console.log($scope.contentArray);
    });

    User.get().$promise.then(function(user) {
      $scope.user = user;
    });

    $scope.getTimes = function(number) {
      return new Array(number);
    };
}]);
