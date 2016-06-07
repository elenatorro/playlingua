angular.module('PlaylinguaApp')
.controller('FriendsController', [
  "$scope", "$http", "$route", "User", "Game", "Exercises",
  function($scope, $http, $route, User, Game, Exercises) {

    $scope.getUserData = function() {
      $scope.followingData = [];
      User.get().$promise.then(function(user) {
        $scope.user = user;
        var game;

        $scope.user.following.forEach(function(user) {
          Exercises.get({'username': user}).$promise.then(function(exercises) {
            game = new Game(exercises);
            $scope.followingData.push({'username': user, 'game': game});
          })
        })
      });
    };

    $scope.search = function(username) {
      $http.get('/userdata/' + username).then(function(user) {
        $scope.foundUser = user.data;
        $scope.foundUser.isFriend = _.contains($scope.user.following, user.data.username);
      });
    };

    $scope.follow = function(username) {
      if (!_.contains($scope.user.following, username)) {
        $http.put('/follow/' + username);
        $route.reload();
      }
    };

    $scope.unfollow = function(username) {
      if (_.contains($scope.user.following, username)) {
        $http.put('/unfollow/' + username);
        $route.reload();
      }
    }

    $scope.getUserData();
  }
]);
