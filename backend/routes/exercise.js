var
 User =      require('../../app/models/user'),
 Exercise =  require('../../app/models/exercise'),
 Text =      require('../../app/models/text');

module.exports = function(app, auth, passport, server) {

  app.get('/exercises/:username?', auth, function(request, response) {
    var username = request.params.username;
    if (!username) username = request.user.user.username;
    var query = Exercise.find({username: username});
    query.exec(function(err, exercises) {
      if (err) {
        response.end(JSON.stringify(err));
      } else {
        response.setHeader('Content-Type', 'application/json;  charset=utf-8');
        response.end(JSON.stringify(exercises));
      }
    });
  });

  app.get('/:name/level/:levelnumber', function(request, response) {
    var query = Text.find({name: request.params.name, level: request.params.levelnumber});
    query.exec(function(err, texts) {
      response.setHeader('Content-Type', 'application/json;  charset=utf-8');
      var game = {
        exercises: texts,
        levelNumber: request.params.levelnumber,
      };
      response.end(JSON.stringify(game));
    });
  });

  app.put('/save/:name/:levelnumber/:score', auth, function(request, response) {
    var userData = request.user;

    var levelNumber = parseInt(request.params.levelnumber) - 1;
    var score = parseInt(request.params.score);
    var name = request.params.name;
    var totalScore = parseInt(userData.user.totalScore) + parseInt(score);
    var maxScore, timesPlayed, lastScore, levelField, exerciseScore;
    var query = User.update({'user.username': userData.user.username},{$set:{'user.totalScore': totalScore}});
    Exercise.find({'name': name, 'username': userData.user.username}, function(err, exercise) {
      if (exercise[0].levels[levelNumber]) {
        maxScore = Math.max(exercise[0].levels[levelNumber].maxScore, score);
        timesPlayed = exercise[0].levels[levelNumber].timesPlayed;
        number = exercise[0].levels[levelNumber].number;
        lastScore = score;
        exerciseScore = exercise[0].levels[levelNumber].totalScore + score;

      } else {
        maxScore = score;
        timesPlayed = 0;
        lastScore = score;
        number = levelNumber + 1;
        exerciseScore = score;
      }

      levelField = 'levels.' + (levelNumber).toString();
      timesPlayed++;

      var exerciseData = {
        name: name,
        username: userData.user.username
      };

      var exerciseUpdate = {$set: {}};
      exerciseUpdate['$set'][levelField] = {
            maxScore: maxScore,
            timesPlayed: timesPlayed,
            number: number,
            lastScore: lastScore,
            totalScore: exerciseScore
          };

      Exercise.update(exerciseData, exerciseUpdate, function(err, data) {
          if (err) {
            response.setHeader('Content-Type', 'application/json;  charset=utf-8');
            response.end(JSON.stringify(err));
          } else {
            query.exec(function(err, data) {
              if (err) {
                response.setHeader('Content-Type', 'application/json;  charset=utf-8');
                response.end(JSON.stringify(err));
              } else {
                response.setHeader('Content-Type', 'application/json;  charset=utf-8');
                response.end(JSON.stringify(data));
              };
            });
          };
      })
    });
  });
}
