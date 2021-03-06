var
  User = require('../models/user'),
  Exercise = require('../models/exercise'),
  Text = require('../models/text'),
  Response = require('../utils/response'),
  ResponseCodes = require('../constants/response-codes');

module.exports = function (app, auth, passport, server) {

  /* Get Exercises by User */
  app.get('/exercises/:username?', auth, function (request, response) {
    var username, query;

    username = request.params.username ? request.params.username : request.user.username;

    query = Exercise.find({ username: username });

    query.exec(function (err, exercises) {
      Response.setJsonHeader(response);

      return err ?
        Response.send(response, err, ResponseCodes.NOT_FOUND) :
        Response.send(response, exercises, ResponseCodes.SUCCESS);
    });
  });

  /* Get Exercise Level Texts */
  app.get('/:name/level/:levelnumber', function (request, response) {
    var query;

    query = Text.find({ name: request.params.name, level: request.params.levelnumber });

    query.exec(function (err, texts) {
      Response.setJsonHeader(response);

      return err ?
        Response.send(response, err, ResponseCodes.NOT_FOUND) :
        Response.send(response, { texts: texts, levelNumber: request.params.levelnumber }, ResponseCodes.SUCCESS);
    });
  });

  /* Update Exercise Score  */
  app.put('/save/:name/:levelnumber/:score', auth, function (request, response) {
    var updateUserQuery, user, levelNumber, score, exerciseName, levelScoreData, levelField, exerciseUpdateData;

    user = request.user;
    levelNumber = parseInt(request.params.levelnumber);
    score = parseInt(request.params.score);
    exerciseName = request.params.name;
    totalScore = parseInt(user.totalScore) + parseInt(score);

    updateUserQuery = User.update({ username: user.username }, { $set: { totalScore: totalScore } });

    Exercise.find({ name: exerciseName, username: user.username }, function (err, exercise) {
      var level;

      exercise = exercise[0];
      level = exercise.levels[levelNumber - 1];

      levelScoreData = level ?
        _updateUserExerciseScore.call(this, exercise, level, levelNumber, score) :
        _initUserExerciseScore.call(this, levelNumber, score);

      exerciseUpdateData = _getExerciseUpdateData.call(this, levelNumber, levelScoreData);

      Exercise.update({ name: exerciseName, username: user.username }, exerciseUpdateData, function (err, data) {
        Response.setJsonHeader(response);

        return err ?
          Response.send(response, err, ResponseCodes.NOT_FOUND) :
          _updateUser.call(this, response, updateUserQuery);
      })
    });
  });
}

/* Private */
function _initUserExerciseScore(levelNumber, score) {
  return {
    lastScore: score,
    maxScore: score,
    number: levelNumber - 1,
    timesPlayed: 1,
    totalScore: score
  }
}

function _updateUserExerciseScore(exercise, level, levelNumber, score) {
  return {
    lastScore: score,
    maxScore: Math.max(level.maxScore, score),
    number: level.number - 1,
    timesPlayed: level.timesPlayed++,
    totalScore: level.totalScore + score
  }
}

function _updateUser(response, updateUserQuery) {
  updateUserQuery.exec(function (err, data) {

    return err ?
      Response.send(response, err, ResponseCodes.NOT_FOUND) :
      Response.send(response, data, ResponseCodes.SUCCESS);
  });
}

function _getExerciseUpdateData(levelNumber, levelScoreData) {
  var exercise, levelField;

  exercise = { $set: {} };
  levelField = _levelField.call(this, levelNumber);

  exercise['$set'][levelField] = levelScoreData;

  return exercise;
}

function _levelField(levelNumber) {
  return 'levels.' + (levelNumber - 1).toString();
}
