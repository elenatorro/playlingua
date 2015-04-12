angular.module('PlaylinguaApp')
.controller('UserController', [
  '$scope', "$http", "User", "Game", "Excercises",
  function($scope, $http, User, Game, Excercises) {
    $scope.test = "Testing...";
    User.get().$promise.then(function(user) {
      $scope.user = user;
      Excercises.get().$promise.then(function(excercises) {
        $scope.game = new Game(excercises);
      })
    });
  }
]);
