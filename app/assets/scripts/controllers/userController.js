angular.module('PlaylinguaApp')
.controller('UserController', [
  "$scope", "$http", "User", "Game", "Exercises",
  function($scope, $http, User, Game, Exercises) {
    $scope.user = User.get();

    Exercises.get().$promise.then(function(exercises) {
      $scope.game = new Game(exercises);
    });
 }]);
