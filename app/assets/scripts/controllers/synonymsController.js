angular.module('PlaylinguaApp')
.controller('SynonymsController', [
  '$scope', "$http", "$routeParams","User", "Level",
  function($scope, $http, $routeParams, User, Level) {
    Level.get({'levelnumber': $routeParams.level}).$promise.then(function(level) {
      $scope.contentArray = _.sample(level.elements, 3);
      $scope.level = level;
      console.log(level);
    });

    User.get().$promise.then(function(user) {
      $scope.user = user;
    });

    $scope.getTimes = function(number) {
      return new Array(number);
    };
}]);
