(function() {
  var body = document.body,
    dropArea = document.getElementById( 'drop-area' ),
    droppableArr = [], dropAreaTimeout;

  var text     = 'Estaba tumbado sobre su espalda en forma de caparazón y al levantar un poco la cabeza veía un vientre abombado dividido por partes duras en forma de arco';
  var answers  = {'concha': 'caparazón', 'partido' : 'dividido', 'tirado' : 'tumbado'};
  var words    = text.split(" ");
  var grid     = document.getElementById('grid');
  var item     = '';
  var dropArea = document.getElementById('drop-area');
  var dropable = '';
  var lifes    = 3;
  var hearts   = document.getElementById('hearts');
  var modal    = document.getElementById('modal-16');

  var isAlive  = function() {
    return (lifes > 0);
  }

  var hasWon   = function() {
    return ((document.getElementsByClassName('grid__item').length == 0) && (isAlive()))
  };

  words.forEach(function(word) {
     dropArea.innerHTML += '<div class="drop-area__item"><p>' + word + '</p></div>';
  })

  for (key in answers) {
    grid.innerHTML += '<div class="grid__item" id="word_'+ key +'"><p><i class="fa fa-arrows"></i> ' + key + '</p></div>';
  };


  [].slice.call( document.querySelectorAll( '#drop-area .drop-area__item' )).forEach(function(el, index) {
    droppableArr.push( new Droppable( el,  {
      onDrop : function( instance, draggableEl ) {
        if (words[index] == answers[draggableEl.id.split('word_')[1]]) {
          grid.removeChild(draggableEl);
          if (hasWon()) showModal(modal, {title: 'Enhorabuena', content: '¡Has superado el nivel!'});
        } else {
          lifes--;
          hearts.removeChild(document.getElementsByClassName('fa fa-heart')[0]);
          if (!isAlive()) showModal(modal, {title: 'Ups!', content: '¡Vuelve a intentarlo!'});
        }
        clearTimeout( instance.checkmarkTimeout );
        instance.checkmarkTimeout = setTimeout( function() {
          classie.remove( instance.el, 'drop-feedback' );
        }, 800 );
      }
    } ) );
  } );


  [].slice.call(document.querySelectorAll( '#grid .grid__item' )).forEach( function( el ) {
    new Draggable( el, droppableArr, {
      draggabilly : { containment: document.body },
      onStart : function() {
        classie.add( body, 'drag-active' );
        clearTimeout( dropAreaTimeout );
      },
      onEnd : function( wasDropped ) {
        var afterDropFn = function() {
          classie.remove( body, 'drag-active' );
        };

        if( !wasDropped ) {
          afterDropFn();
        }
        else {
          clearTimeout( dropAreaTimeout );
          dropAreaTimeout = setTimeout( afterDropFn, 400 );
        }
      }
    });
  });
})();
