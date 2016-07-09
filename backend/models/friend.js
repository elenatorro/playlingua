var
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  Models = require('../constants/models');

var friendSchema = mongoose.Schema({
  friend: {
    mainfriendid: String,
    anotherfriendid: String,
  }
});

module.exports = mongoose.model(Models.FRIEND, friendSchema);
