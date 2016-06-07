var mongoose = require('mongoose');

var exerciseSchema = mongoose.Schema({
    name: String,
    username: String,
    title: String,
    levels : [
      {
      number: Number,
      lastScore   : { type: Number, default: 0 },
      maxScore    : { type: Number, default: 0 },
      timesPlayed : { type: Number, default: 0 },
      totalScore  : { type: Number, default: 0 }
    }]
});

exerciseSchema.methods.createExercise = function(request, done) {
  
}


module.exports = mongoose.model('Exercise', exerciseSchema);
