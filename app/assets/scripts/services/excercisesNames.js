'use strict';
angular.module('PlaylinguaApp').service('ExcercisesNames', function() {
  var self = this;

  self.information = {
    'sinonimos': {
    	'title':'Sinónimos',
    	'help': 'Arrastra la palabra o las palabras que tienen el icono de una mano sobre la palabra de la frase'
				+ ' que creas que es su sinónimo. Cuando completes todos los ejercicios, sumarás cinco puntos por cada corazón'
    			+ ' que tengas. Cada vez que cometes un error, pierdes un corazón. Recuerda dos palabras son'
    			+ ' sinónimas cuando tienen el mismo significado pero se escriben de diferente forma.',
    	'extraHelp': {
			'1': '¡Cuando consigas cien puntos, ganarás una estrella!',
			'2': '¡Atención! Puede que varias palabras tengan el mismo sinónimo.',
			'3': 'Recuerda que puede haber varias palabras con el mismo sinónimo.'
    		}
    	},
    'definiciones': {
    	'title':'Definiciones',
    	'help': 'Arrastra cada definición sobre la palabra de la frase que creas que es su sinónimo. '
				+ 'Cuando completes todos los ejercicios, sumarás cinco puntos por cada corazón'
    			+ 'que tengas. Cada vez que cometes un error, pierdes un corazón.',
    	'extraHelp': {
			'1': '¡Cuando consigas cien puntos, ganarás una estrella!',
			'2': '¡Atención! Puede que varias palabras en la frase tengan el mismo significado.',
			'3': 'Recuerda que puede haber varias palabras con el mismo significado.'
    		}
    	}
  };

  self.get = function(name) {
    return self.information[name];
  }
});