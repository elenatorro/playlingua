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
        self.animal     = _.sample(['lion','elephant','cok','castor', 'chicken', 'cow',
                          'dog','donkey','duck','monkey','penguin','pig','puppy','seal','zebra']);

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
