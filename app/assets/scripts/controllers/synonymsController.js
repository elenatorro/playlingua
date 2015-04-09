angular.module('PlaylinguaApp')
.controller('SynonymsController', [
  '$scope', "$http", "$routeParams","User", "Level",
  function($scope, $http, $routeParams, User, Level) {
    Level.get({'levelnumber': $routeParams.level}).$promise.then(function(level) {
      delete level.excercises._id;
      $scope.level = level;
      $scope.contentArray = level.excercises.content;
      console.log($scope.content);
      $scope.words = level.excercises.content[0].elements.words.replace(/[,;:.]/g, "").split(" ");
      $scope.dragWords = level.excercises.content[0].elements.selected;
    });

    User.get().$promise.then(function(user) {
      $scope.user = user;
      $scope.game = user.game;
    });

    $scope.onDrop = function(word, object) {
      if (word == object.word) {
        console.log("yay");
      } else {
        $scope.level.lifes.pop();
      }
    };

    $scope.sliderFx = new SliderFx( document.getElementById('slideshow'), {
          easing : 'cubic-bezier(.8,0,.2,1)'});
}]);
