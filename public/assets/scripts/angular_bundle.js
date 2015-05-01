'use strict';

  angular.module('PlaylinguaApp', ['ngResource',  'ngRoute', 'djds4rce.angular-socialshare',
                                    'ngAnimate', 'ngDraggable', 'ngTouch', 'ngAudio', 'ngDialog'])
  .config(['$locationProvider', '$routeProvider',
    function($locationProvider, $routeProvider) {

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });

      $routeProvider
        .when("/dashboard/user", {
          templateUrl: "/views/users/index.html",
          controller: "UserController"
        })
        .when("/dashboard/:name/:level", {
          templateUrl: function(params){ return "/views/games/" + params.name + ".html";},
          controller: "LevelController"
        })
        .when("/dashboard/friends", {
          templateUrl: "/views/users/friends.html",
          controller: "FriendsController"
        })
        .otherwise({
           redirectTo: '/dashboard/user'
        });
    }
  ]);

'use strict';
angular.module('PlaylinguaApp').service('ExcercisesNames', function() {
  var self = this;

  self.information = {
    'sinonimos': {
    	'title':'Sinónimos',
      'help': '/assets/templates/help/sinonimos.html'
    },
    'definiciones': {
    	'title':'Definiciones',
    	'help': '/assets/templates/help/definiciones.html'
    },
    'completar': {
      'title':'Completar',
      'help': '/assets/templates/help/completar.html'
    }
  };

  self.get = function(name) {
    return self.information[name];
  }
});
'use strict';
angular.module('PlaylinguaApp').factory('Excercises', 
  ['$resource', '$http', '$q', function($resource, $http, $q) {
    function Excercises(data) {
        angular.extend(this, data);
        var self = this;
    };

    var resourceExcercises = $resource(
      '/excercises/:username',
      {},
      {
        'get':{
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          transformResponse: function(response){
            return new Excercises({excercises: JSON.parse(response)});
          }
        }
      });

    angular.extend(Excercises, resourceExcercises);

    return Excercises;
}]);

'use strict';
angular.module('PlaylinguaApp')
.factory('Game', ['$http', '$q', function($http, $q) {
    function Game(data) {
      this.excercises = data.excercises;
      this.excercises.forEach(function(excercise) {
        excercise = excercise[0];
      })
      var self = this;

      self.setExcercises = function(excercises) {
        self.excercises = excercises;
      };

      self.getExcercises = function() {
        return self.excercises;
      };

      self.getExcercise = function(name) {
        return _.where(self.excercises, {name: name});
      };

      self.getTotalExcerciseScore = function(excercise) {
        var totalScore = 0;
        var auxExcercise;
        if (!excercise.levels) {
          auxExcercise = excercise[0];
        } else {
          auxExcercise = excercise;
        }
        auxExcercise.levels.forEach(function(level) {
          totalScore += level.totalScore;
        })
        return totalScore;
      };


      self.isExcercises = function() {
        return (self.excercises.length!=0);
      }

      self.createLevels = function(name) {
        $http.post('/createlevels/' + name).success(function(data) {
        }).error(function(data) {
        })
      };

      self.getProgress = function(excercise, level) {
        if (self.isExcercises()) {
        var findExcercise =  _.findWhere(self.excercises, {'name':excercise});
          if (findExcercise.levels[level]) {
            return findExcercise.levels[level].totalScore;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      };

      self.trophyTitles = {
        25   : 'Principiante',
        50   : 'Aspirante',
        75   : 'Novato',
        100  : 'Aprendiz',
        125  : 'Intermedio',
        150  : 'Avanzado',
        175  : 'Profesional',
        200  : 'Máquina',
        225  : 'Experto',
        250  : 'Pro',
        275  : 'Supremo',
        300  : 'Súper Estrella'
      };

      self.getTrophy = function(points) {
        return self.trophyTitles[points];
      };

      self.getTrophyTitle = function(excercise) {
        var score = self.getTotalExcerciseScore(self.getExcercise(excercise));
        for (var points in self.trophyTitles) {
          if ((score >= (parseInt(points) - 25)) && (score < (parseInt(points) + 25))) {
            return self.trophyTitles[points];
            break;
            }
          }
        return self.trophyTitles[300];
      };

      self.getStarsNumber = function() {
        var stars = 0;
        self.excercises.forEach(function(excercise) {
          excercise.levels.forEach(function(level) {
            if (level.totalScore >= 100) stars++;
          })
        })
        return stars;
      };

      self.stars = new Array(self.getStarsNumber());


      self.getProgress = function(score) {
        if (score > 100) return 100;
        else return score;
      }
    };

    return Game;
}]);

'use strict';
angular.module('PlaylinguaApp').factory('Level',
['$resource', '$http', '$q', 'ngAudio', 'ExcercisesNames', 'ngDialog',
 function($resource, $http, $q, ngAudio, ExcercisesNames, ngDialog){
    function Level(data) {
        angular.extend(this, data);
        var self = this;

        self.lifes      = 5;
        self.progress   = 0;
        self.soundRight = ngAudio.load("/assets/sounds/goodshort.wav");
        self.soundWrong = ngAudio.load("/assets/sounds/wrongshort.wav");
        self.soundEnd   = ngAudio.load("/assets/sounds/endshort.wav");
        self.muted      = false;
        self.title      = ExcercisesNames.get(self.name)['title'];
        self.help       = ExcercisesNames.get(self.name)['help'];

        self.getContent = function() {
          return self.content;
        };

        self.play = function(sound) {
          if (!self.muted) sound.play();
        };

        self.mute = function(muted) {
          self.muted = muted;
        };

        self.openHelp = function () {
          ngDialog.open({ 
                template: self.help,
          });
        };

        self.updateProgress = function(excercisesNumber) {
          self.progress += (100/excercisesNumber);
        };

        self.getProgress = function() {
          return self.progress;
        };
        
        self.updateScore = function(score) {
          $http.put('/save/' + self.name + '/' + self.level + '/' + score)
          .success(function(data) {
          })
          .error(function(data) {
          })
        };
    };

    var resourceLevel = $resource(
      '/:name/level/:levelnumber',
      {},
      {
        'get':{
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          transformResponse: function(response){
            var jsData = angular.fromJson(response);
            delete jsData.excercises[0]._id;
            return new Level(jsData.excercises[0]);
          }
        }
      });

    angular.extend(Level, resourceLevel);

    return Level;
}]);

'use strict';
angular.module('PlaylinguaApp').factory('User', 
  ['$resource', '$http', '$q', 
  function($resource, $http, $q){
    function User(data) {
        angular.extend(this, data);
        var self = this;

        self.getUsername = function() {
          return self.username;
        };
    };

    var resourceUser = $resource(
      '/user',
      {},
      {
        'get':{
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          transformResponse: function(response){
            var jsData = angular.fromJson(response);
            return new User(jsData);
          }
        }
      });

    angular.extend(User, resourceUser);

    return User;
}]);

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
      $scope.corrects = {};
      $q.when($scope.level).then(function(level) {
        $scope.next = function() {
          $scope.level.updateProgress($scope.contentarray.length);
          $scope.currentIndex < $scope.contentarray.length -1 ? $scope.currentIndex++ : $scope.endGame(true);
        };

        $scope.prev = function() {
          $scope.currentIndex > 0 ? $scope.currentIndex-- : $scope.contentarray.length - 1;
        };

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
            if ($scope.corrects[$scope.selectedWords[key].value] != $scope.selectedWords[key].value) {
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

angular.module('PlaylinguaApp')
.directive('levelProgress',
  function() {
  return {
    template: '<div class="progress progress-striped">' +
      '<div class="progress-bar progress-bar-info" style="width: {{progressWidth}}%"></div>' +
      '</div>',
    };
  });

angular.module('PlaylinguaApp')
.directive('sliderpanel',
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
      $scope.corrects = [];
      $q.when($scope.level).then(function(level) {
        $scope.next = function() {
          $scope.level.updateProgress($scope.contentarray.length);
          $scope.currentIndex < $scope.contentarray.length -1 ? $scope.currentIndex++ : $scope.endGame(true);
        };

        $scope.prev = function() {
          $scope.currentIndex > 0 ? $scope.currentIndex-- : $scope.contentarray.length - 1;
        };

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
          $scope.words     = $scope.getWords($scope.contentarray[$scope.currentIndex]);
          $scope.dragWords = $scope.getDragWords($scope.contentarray[$scope.currentIndex]);
        });

        $scope.getWords = function(content) {
          return content.words.replace(/[,;:.-]/g, "").split(" ");
        };

        $scope.getDragWords = function(content) {
          return content.selected;
        };

        $scope.hideAll = function() {
          $scope.contentarray.forEach(function(content) {
            content.visible = false;
          });
        };

        $scope.onDrop = function(word, object) {
          if (word == object.word) {
            $scope.level.play($scope.level.soundRight);
            $scope.corrects.push(object);
            $scope.dragWords.splice($scope.dragWords.indexOf(object), 1);
            if ($scope.dragWords.length == 0) $scope.next();
          } else {
            $scope.level.play($scope.level.soundWrong);
            $scope.level.lifes--;
            if ($scope.level.lifes == 0) $scope.endGame(false);
          }
        };
      })
    },
    templateUrl: '/assets/templates/sliderPanel.html',
      replace: 'true',
  };
});


angular.module('PlaylinguaApp')
.controller('FriendsController', [
  "$scope", "$http", "$route", "User", "Game", "Excercises",
  function($scope, $http, $route, User, Game, Excercises) {

    $scope.getUserData = function() {
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

angular.module('PlaylinguaApp')
.controller('LevelController', [
  "$scope", "$http", "$routeParams","User", "Level",
  function($scope, $http, $routeParams, User, Level) {
    Level.get({'name': $routeParams.name, 'levelnumber': $routeParams.level}).$promise.then(function(level) {
      $scope.contentArray = _.sample(level.elements, 3);
      $scope.level = level;
      $scope.level.progressImage = $scope.progressImage;
    });

    User.get().$promise.then(function(user) {
      $scope.user = user;
    });

    $scope.getTimes = function(number) {
      return new Array(number);
    };
}]);

angular.module('PlaylinguaApp')
.controller('UserController', [
  "$scope", "$http", "User", "Game", "Excercises",
  function($scope, $http, User, Game, Excercises) {
    $scope.user = User.get();

    Excercises.get().$promise.then(function(excercises) {
      $scope.game = new Game(excercises);
    });
 }]);
