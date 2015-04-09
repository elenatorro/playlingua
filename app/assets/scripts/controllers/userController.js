angular.module('PlaylinguaApp')
.controller('UserController', [
  '$scope', "$http", "User", "Game",
  function($scope, $http, User, Game) {
    $scope.test = "Testing...";
    User.get().$promise.then(function(user) {
      $scope.user = user;
      $scope.game = new Game(user.game);
      console.log($scope.game);
    });
  }
]);
