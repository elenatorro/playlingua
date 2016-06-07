angular.module('PlaylinguaApp')
.directive('completepanel',
  function($timeout, $q) {
  return {
    restrict: 'E',
    scope: {
      level: '=',
      contentarray: '='
    },

    link: function($scope, elem, attrs) {
      $scope.currentIndex = 0;
      $scope.isFinished = false;
      $scope.answered = {};
      $scope.corrects = [];
      $q.when($scope.level).then(function(level) {
        $scope.next = function() {
          $scope.level.updateProgress($scope.contentarray.length);
          $scope.saveCorrects();
          $scope.currentIndex < $scope.contentarray.length -1 ? $scope.currentIndex++ : $scope.endGame(true);
        };

        $scope.prev = function() {
          $scope.currentIndex > 0 ? $scope.currentIndex-- : $scope.contentarray.length - 1;
        };

        $scope.saveCorrects = function() {
          $scope.selectedWords.forEach(function(correct) {
            $scope.corrects.push(correct);
          })
        }

        $scope.endGame = function(win) {
          $scope.isFinished = true;
          $scope.hideAll();
          $scope.level.play($scope.level.soundEnd);
          if (win) {
            var score = $scope.level.lifes * 5;
            $scope.level.updateScore(score);
            $scope.message = "¡Felicidades!";
            $scope.score   = "¡Has ganado " + score + " puntos!";
          } else {
            $scope.message = "Ups!";
            $scope.score   = "No pasa nada, puedes volver a intentarlo :)";
          }
        };

        $scope.$watch('currentIndex', function() {
          $scope.hideAll();
          $scope.contentarray[$scope.currentIndex].visible = true;
          $scope.selectedWords = $scope.getSelectedWords($scope.contentarray[$scope.currentIndex]);
          $scope.words         = $scope.getWords($scope.contentarray[$scope.currentIndex], $scope.selectedWords);
        });

        $scope.getWords = function(content, selectedWords) {
          var words = content.words.split(" ");
          var parsedWords = [];
          var selected;
          words.forEach(function(word) {
            selected = _.where(selectedWords, {"value":word});
            if (selected.length!=0) {
              parsedWords.push({"word":word, "value": selected[0].word, "input":true});
            } else {
              parsedWords.push({"word":word, "input":false})
            }
          })
          return parsedWords;
        };

        $scope.getSelectedWords = function(content) {
          return content.selected;
        };

        $scope.hideAll = function() {
          $scope.contentarray.forEach(function(content) {
            content.visible = false;
          });
        };

        $scope.checkWords = function() {
          var win = true;
          for (var key in $scope.selectedWords) {
            if ($scope.answered[$scope.selectedWords[key].value] != $scope.selectedWords[key].value) {
              win = false;
              $scope.lose();
            }
          }
          if (win) $scope.win();
        };

        $scope.win = function() {
          $scope.level.play($scope.level.soundRight);
          $scope.next();
        };

        $scope.lose = function() {
            $scope.level.play($scope.level.soundWrong);
            $scope.level.lifes--;
            if ($scope.level.lifes == 0) $scope.endGame(false);
        };
      })
    },
    templateUrl: '/assets/templates/completePanel.html',
      replace: 'true',
  };
});
