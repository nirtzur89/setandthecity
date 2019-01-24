const mongoose     = require('mongoose');

const UserSchema = new  mongoose.Schema({
  username:  String,
  email:     String,
  token:     String,
  spotifyId: String,
  name:      String
});

const User = mongoose.model('User', UserSchema);


module.exports = User;