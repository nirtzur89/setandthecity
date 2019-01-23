const mongoose     = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')

var UserSchema = new  mongoose.Schema({
  token:    String,
  spotifyId: String,
  name:     String,
  username: String,
  email:    String
});

UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', UserSchema);; 