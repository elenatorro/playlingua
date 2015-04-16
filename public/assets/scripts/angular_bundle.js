'use strict';

  angular.module('PlaylinguaApp', ['ngResource', 'ngRoute', 'ngAnimate', 'ngDraggable'])

  .config([
    '$locationProvider',
    '$routeProvider',
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
        .when("/dashboard/sinonimos/:level", {
          templateUrl: "/views/synonyms/index.html",
          controller: "SynonymsController"
        })
        .otherwise({
           redirectTo: '/dashboard/user'
        });
    }
  ]);

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
      $q.when($scope.level).then(function(level) {
        $scope.next = function() {
          $scope.currentIndex < $scope.contentarray.length -1 ? $scope.currentIndex++ : $scope.endGame(true);
        };

        $scope.prev = function() {
          $scope.currentIndex > 0 ? $scope.currentIndex-- : $scope.contentarray.length - 1;
        };

        $scope.endGame = function(win) {
          $scope.hideAll();
          $scope.isFinished = true;
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
            $scope.dragWords.splice($scope.dragWords.indexOf(object), 1);
            if ($scope.dragWords.length == 0) $scope.next();
          } else {
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

'use strict';
angular.module('PlaylinguaApp').factory('Excercises', ['$resource', '$http', '$q', function($resource, $http, $q){
    function Excercises(data) {
        angular.extend(this, data);
        var self = this;
    };

    var resourceExcercises = $resource(
      '/excercises',
      {},
      {
        'get':{
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          transformResponse: function(response){
            console.log(JSON.parse(response));
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
      console.log(this);
      var self = this;

      self.setExcercises = function(excercises) {
        self.excercises = excercises;
      };

      self.getExcercises = function() {
        return self.excercises;
      }

      self.isExcercises = function() {
        return (self.excercises.length!=0);
      }

      self.createLevels = function(name) {
        $http.post('/createlevels/' + name).success(function(data) {
          console.log(data);
        }).error(function(data) {
          console.log(data);
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
        return self.tropyTitles(points);
      };

      // self.excercisesData = [
      //   {
      //     name: 'Sinónimos',
      //     url: 'synonyms',
      //     image: "../assets/icons/polaroids.png",
      //     levels: [
      //       {
      //         number: 1,
      //         title: 'Nivel 1',
      //         image: '../assets/icons/unicycle.png',
      //         progress: self.getProgress('sinonimos',0)
      //         // passed: self.isGold('sinonimos',0)
      //       },{
      //         number: 2,
      //         title: 'Nivel 2',
      //         image: '../assets/icons/bike.png',
      //         progress: self.getProgress('sinonimos',1)
      //         // passed: self.isGold('sinonimos',1)
      //
      //       },{
      //         number: 3,
      //         title: 'Nivel 3',
      //         image: '../assets/icons/motorcycle.png',
      //         progress: self.getProgress('sinonimos',2)
      //         // passed: self.isGold('sinonimos',2)
      //       }
      //     ]
      //   },{
      //     name: 'Definiciones',
      //     url: 'definitions',
      //     image: "../assets/icons/bookshelf.png",
      //     levels: [
      //       {
      //         number: 1,
      //         title: 'Nivel 1',
      //         image: '../assets/icons/plane.png',
      //         progress: self.getProgress('definiciones',0)
      //         // passed: self.isGold('definiciones',0)
      //       },{
      //         number: 2,
      //         title: 'Nivel 2',
      //         image: '../assets/icons/rocket.png',
      //         progress: self.getProgress('definiciones',1)
      //         // passed: self.isGold('definiciones',0)
      //       },{
      //         number: 3,
      //         title: 'Nivel 3',
      //         image: '../assets/icons/spaceshuttle.png',
      //         progress: self.getProgress('definiciones',2)
      //         // passed: self.isGold('definiciones',0)
      //       }
      //     ]
      //   }
      // ]
    };

    return Game;
}]);

'use strict';
angular.module('PlaylinguaApp').factory('Level', ['$resource', '$http', '$q', function($resource, $http, $q){
    function Level(data) {
        angular.extend(this, data);
        var self = this;

        self.getContent = function() {
          return self.content;
        };

        self.lifes = 5;

        self.updateScore = function(score) {
          $http.put('/save/' + self.name + '/' + self.level + '/' + score)
          .success(function(data) {
            console.log('OK');
          })
          .error(function(data) {
            console.log(data);
            console.log('error');
          })
        };

        self.animal = _.sample(['lion','elephant','cok','castor', 'chicken', 'cow',
          'dog','donkey','duck','monkey','penguin','pig','puppy','seal','zebra']);
    };

    var resourceLevel = $resource(
      '/sinonimos/level/:levelnumber',
      {},
      {
        'get':{
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          transformResponse: function(response){
            var jsData = angular.fromJson(response);
            console.log(jsData);
            delete jsData.excercises[0]._id;
            return new Level(jsData.excercises[0]);
          }
        }
      });

    angular.extend(Level, resourceLevel);

    return Level;
}]);

'use strict';
angular.module('PlaylinguaApp').factory('User', ['$resource', '$http', '$q', function($resource, $http, $q){
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
