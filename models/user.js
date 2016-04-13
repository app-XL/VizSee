var path            = require('path');
var mongoose        = require('mongoose'), Schema = mongoose.Schema;
var bcrypt          = require('bcrypt-nodejs');
var jwt             = require('jwt-simple');
var constants       = require('../scripts/constants');
var config          = require(path.join(constants.paths.config, '/config'));
var groupSchema     = require('./group');

var Token = mongoose.Schema({
    token           : {type: String},
    dateCreated     : {type: Date, default: Date.now},
});

Token.statics.hasExpired= function(created) {
    var now = new Date();
    var diff = (now.getTime() - created);
    return diff > config.get('auth.ttl');
};

var TokenModel = mongoose.model('Token', Token);

// define the schema for our user model
var userSchema = mongoose.Schema({
    name             : {
      prefix         : String,
      first          : String,
      middle         : String,
      last           : String,
      suffix         : String
    },
    email            : String,
    avatar           : String,
    summary          : String,
    jobTitle         : String,
    organization     : String,
		orgRef					 : { type: Schema.Types.ObjectId, ref: 'client' },
		association			 : {type: String, enum: ['employee', 'partner', 'customer', 'contractor']},
    socialProfile    : [{
      handle         : String,
      network        : String
    }],
    contactNo        : [{
      contactNumber         : String,
      contactType           : String
    }],
    stats            : {
      dateCreated    : Date,
      dateLastLogin  : Date
    },
    preferences      : {
      language       : String
    },
    local            : {
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    token            : {type: Object},
    status           : {type: String, default: 'Active'},
    memberOf         : [{ type: Schema.Types.ObjectId, ref: 'group' }]

});

// Execute before each user.save() call
userSchema.pre('save', function(callback) {
    var user = this;

    // Break out if the password hasn't changed
    //if (!user.isModified('password')) return callback();
    this.token = genToken();
    console.log("token updated");
    callback();

  // Password changed so we need to hash it
/*  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });*/
});

userSchema.post('init', function(doc) {
  if(doc.avatar === undefined){
    doc.avatar = "/public/assets/g/imgs/avatar.jpg";
  }
});

userSchema.post('find', function(result) {
  //console.log(this instanceof mongoose.Query); // true
  // prints returned documents
  console.log('find() returned ' + JSON.stringify(result));
  // prints number of milliseconds the query took
  console.log('find() took ' + (Date.now() - this.start) + ' millis');
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// private method
function genToken() {
  var expires = expiresIn(config.get('auth.expires'));
  var token = jwt.encode({
    exp: expires
  }, config.get('auth.secret'));

  return {
    token: token,
    dateCreated: new Date()
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
module.exports.Token = TokenModel;
