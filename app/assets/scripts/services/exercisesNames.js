'use strict';
angular.module('PlaylinguaApp').service('ExercisesNames', function() {
  var self = this;

  self.information = {
    sinonimos: {
    	'title':'Sinónimos',
      'help': '/assets/templates/help/sinonimos.html'
    },
    definiciones: {
    	'title':'Definiciones',
    	'help': '/assets/templates/help/definiciones.html'
    },
    completar: {
      'title':'Completar',
      'help': '/assets/templates/help/completar.html'
    }
  };

  self.get = function(name) {
    return self.information[name];
  }
});
