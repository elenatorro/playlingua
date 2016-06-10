'use strict';
angular.module('PlaylinguaApp').factory('Level',
['$resource', '$http', '$q', 'ngAudio', 'ExercisesNames', 'ngDialog',
 function($resource, $http, $q, ngAudio, ExercisesNames, ngDialog){
    function Level(data) {
        angular.extend(this, data);
        var self = this;

        self.lifes      = 5;
        self.progress   = 0;
        self.soundRight = ngAudio.load("/assets/sounds/goodshort.wav");
        self.soundWrong = ngAudio.load("/assets/sounds/wrongshort.wav");
        self.soundEnd   = ngAudio.load("/assets/sounds/endshort.wav");
        self.muted      = false;
        self.title      = ExercisesNames.get(self.name)['title'];
        self.help       = ExercisesNames.get(self.name)['help'];

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

        self.updateProgress = function(exercisesNumber) {
          self.progress += (100/exercisesNumber);
        };

        self.getProgress = function() {
          return self.progress;
        };

        self.updateScore = function(score) {
          $http.put('/save/' + self.name + '/' + self.level + '/' + score)
          .success(function(data) {})
          .error(function(data) {})
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
            delete jsData.exercises[0]._id;
            return new Level(jsData.exercises[0]);
          }
        }
      });

    angular.extend(Level, resourceLevel);

    return Level;
}]);
