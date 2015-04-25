'use strict';
angular.module('PlaylinguaApp').factory('Level',
['$resource', '$http', '$q', 'ngAudio', function($resource, $http, $q, ngAudio){
    function Level(data) {
        angular.extend(this, data);
        var self = this;

        self.getContent = function() {
          return self.content;
        };

        self.lifes = 5;

        self.soundRight = ngAudio.load("/assets/sounds/goodshort.wav");
        self.soundWrong = ngAudio.load("/assets/sounds/wrongshort.wav");
        self.soundEnd   = ngAudio.load("/assets/sounds/endshort.wav");

        self.play = function(sound) {
          if (!self.muted) sound.play();
        };

        self.muted = false;

        self.mute = function(muted) {
          self.muted = muted;
        };
        
        self.updateScore = function(score) {
          $http.put('/save/' + self.name + '/' + self.level + '/' + score)
          .success(function(data) {
          })
          .error(function(data) {
          })
        };

        self.animal = _.sample(['lion','elephant','cok','castor', 'chicken', 'cow',
          'dog','donkey','duck','monkey','penguin','pig','puppy','seal','zebra']);
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
