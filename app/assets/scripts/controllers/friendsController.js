angular.module('PlaylinguaApp')
.controller('FriendsController', [
  '$scope', "$http", "User", "Game", "Excercises",
  function($scope, $http, User, Game, Excercises) {
    $scope.followingData = [];
    User.get().$promise.then(function(user) {
      $scope.user = user;
      var game;
      $scope.user.following.forEach(function(user) {
        Excercises.get({'username': user}).$promise.then(function(excercises) {
          game = new Game(excercises);
          $scope.followingData.push({'username': user, 'game': game});
        })
      })
    });


    $scope.search = function(username) {
      $http.get('/userdata/' + username).then(function(user) {
        $scope.foundUser = user.data;
        $scope.foundUser.isFriend = _.contains($scope.user.following, user.data.username);
      });
    };

    $scope.follow = function(username) {
      if (!_.contains($scope.user.following, username)) {
        $http.put('/follow/' + username).then(function(message) {
          /* TODO   update following data*/
        });
      }
    };
  }
]);
