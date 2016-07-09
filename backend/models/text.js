var
  mongoose = require('mongoose'),
  Models = require('../constants/models');

var textSchema = mongoose.Schema({
  text: {
    name: String,
    level: Number,
    elements: [{
      words: String,
      selected: [{
        word: String,
        value: String
      }]
    }]
  }
});


module.exports = mongoose.model(Models.TEXT, textSchema);
