var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    user             : {
  	  username     : String,
      email        : String,
      password     : String,
  	  name	       : String,
  	  address      : String,
      game : {
        totalScore   : { type: Number, default: 0 },
        excercises   : [{
          name : {type: String, default: 'sinonimos'},
          levels : [{
            number: Number,
            lastScore   : { type: Number, default: 0 },
            maxScore    : { type: Number, default: 0 },
            timesPlayed : { type: Number, default: 0 }
            }]
          },{
            name : {type: String, default: 'definiciones'},
            levels : [{
              number: Number,
              lastScore   : { type: Number, default: 0 },
              maxScore    : { type: Number, default: 0 },
              timesPlayed : { type: Number, default: 0 }
            }]
        }]
      }
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.user.password);
};

userSchema.methods.updateUser = function(request, response){

	this.user.name = request.body.name;
	this.user.address = request.body.address;
	 this.user.save();
	response.redirect('/user');
};



module.exports = mongoose.model('User', userSchema);
