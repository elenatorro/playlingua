{
  name: 'sinonimos',
    $addToSet: {
    content: {
      [{
        level: 1,
        $push: {
          elements: {
            words: 'Un manto de nieve, raído, agujereado, tenue, cubría la tierra descolorida.',
            selected: {
              $each: [{
                    word: 'tenue',
                    value: 'débil'
                  }, {
                    word: 'agujereado',
                    value: 'perforado'
                  }]
            }
          }
        }
      }]
    }
}

db.objects.update({name: 'sinonimos'}, {'$addToSet': {'content.2.blocks.0.txt': 'hi'}})







{
  name: 'sinonimos',
    content: [{
        level: 1,
          elements: {
            words: 'Se lo podía ver en los días de buen tiempo, cuando el río fluía más lentamente y las aguas barrosas se aclaraban',
            selected: [{
                  word: 'fluía',
                  value: 'fluctuaban'
                }]
            }
          }]
        }


db.collection.update({'name': 'sinonimos'},{content.})
