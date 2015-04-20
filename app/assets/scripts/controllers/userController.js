angular.module('PlaylinguaApp')
.controller('UserController', [
  '$scope', "$http", "User", "Game", "Excercises",
  function($scope, $http, User, Game, Excercises) {
    $scope.user = User.get();

    Excercises.get().$promise.then(function(excercises) {
      $scope.game = new Game(excercises);
    });
  }
]);
