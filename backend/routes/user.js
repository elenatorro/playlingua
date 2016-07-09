var
  User = require('../models/user'),
  Exercise = require('../models/exercise'),
  Response = require('../utils/response'),
  ResponseCodes = require('../constants/response-codes'),
  ResponseErrors = require('../constants/response-errors');

module.exports = function (app, auth, passport, server) {

  app.get('/user', auth, function (request, response) {
    Response.setJsonHeader(response);

    return request.user ?
      Response.send(response, request.user, ResponseCodes.SUCCESS) :
      Response.send(response, ResponseErrors.USER_NOT_FOUND, ResponseCodes.NOT_FOUND);
  });

  app.get('/userdata/:username', auth, function (request, response) {
    var query, user;

    query = Exercise.find({ username: request.params.username }, { '_id': 0 });
    query.select('name levels');

    query.exec(function (err, exercises) {
      Response.setJsonHeader(response);

      return err ?
        Response.send(response, response.JSON.stringify(err), ResponseCodes.NOT_FOUND) :
        _responseSendUserExercises.call(this, exercises, request, response);
    });
  });

  app.put('/follow/:username', auth, function (request, response) {
    var followQuery = User.find({ username: request.params.username }, { '_id': 0 });
    followQuery.select('username followers following');

    followQuery.exec(function (err, friend) {
      friend = friend[0];

      return err ?
        Response.send(response, err, ResponseErrors.NOT_FOUND) :
        _addFollower.call(this, friend, request, response);
    })
  });

  app.put('/unfollow/:username', auth, function (request, response) {
    var unfollowQuery = User.find({ username: request.params.username }, { '_id': 0 });

    unfollowQuery.select('username followers following');
    unfollowQuery.exec(function (err, friend) { //not a friend anymore :(
      friend = friend[0];

      return err ?
        Response.send(response, err, ResponseErrors.NOT_FOUND) :
        _removeFollower.call(this, friend, request, response);
    });
  });
};

/* Private */

function _responseSendUserExercises(exercises, request, response) {
  return exercises.length ?
    Response.send(response, { username: request.params.username, exercises: exercises }, ResponseCodes.SUCCESS) :
    Response.send(response, ResponseErrors.USER_EXERCISES_EMPTY, ResponseCodes.NOT_FOUND)
}

function _addFollower(friend, request, response) {
  var query;

  query = User.update({ username: friend.username }, { $addToSet: { followers: request.user.username } });

  query.exec(function (err, user) {
    return err ?
      Response.send(response, err, ResponseCodes.NOT_FOUND) :
      _addFollowing.call(this, friend, request, response);
  });
}

function _removeFollower(friend, request, response) {
  var query;

  query = User.update({ username: friend.username }, { $pull: { followers: request.user.username } });

  query.exec(function (err, oldFriend) {
    friend = oldFriend[0];

    return err ?
      Response.send(response, err, ResponseCodes.NOT_FOUND) :
      _removeFollowing.call(this, friend, request, response);
  });
}

function _addFollowing(friend, request, response) {
  var query;

  query = User.update({ username: request.user.username }, { $addToSet: { following: friend.username } });

  query.exec(function (err, user) {
    user = user[0];

    return err ?
      Response.send(response, err, ResponseCodes.NOT_FOUND) :
      Response.send(response, { friend: friend }, ResponseCodes.SUCCESS);
  });
}

function _removeFollowing(friend, request, response) {
  var query;

  query = User.update({ username: request.user.username }, { $pull: { following: friend.username } });

  query.exec(function (err, user) {
    user = user[0];

    return err ?
      Response.send(response, err, ResponseCodes.NOT_FOUND) :
      Response.send(response, { friend: friend }, ResponseCodes.SUCCESS);
  });
}
