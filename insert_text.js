{
  name: 'sinonimos',
  $push : {
    content: {
    $each: [{
        level: 1,
        $push: {
          elements: {
            words: 'Estaba tumbado sobre su espalda dura, y en forma de caparazón y, al levantar un poco la cabeza veía un vientre abombado, parduzco, dividido por partes duras en forma de arco',
            selected: {
              $each: [{
                  word: 'tumbado',
                  value: 'derribado'
                },{
                  word: 'caparazon',
                  value: 'concha'
                },{
                  word: 'dividido',
                  value: 'partido'
              }]
            }
          }
        }
      }]
    }
  }
}
