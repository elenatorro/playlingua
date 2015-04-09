{
  name: 'sinonimos',
  $push : {
    content: {
    $each: [{
        level: 1,
        $push: {
          elements: {
            words: 'El viento sur, caliente y perezoso, empujaba las nubes blanquecinas que se rasgaban al correr hacia el norte.',
            selected: {
              $each: [{
                  word: 'empujaba',
                  value: 'apretaba'
                }]
            }
          }
        }
      }]
    }
  }
}

{
  name: 'sinonimos',
    content: [{
        level: 1,
          elements: {
            words: 'Era lo que ansiaban, y por eso se asustaron.',
            selected: [{
                  word: 'ansiaban',
                  value: 'anhelaban'
                }, {
                  word: 'asustaron',
                  value: 'espantaron'
                }]
            }
          }]
        }
