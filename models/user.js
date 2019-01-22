const mongoose     = require('mongoose');

const UserSchema = new  mongoose.Schema({
  token:    String,
  spotifyId: String,
  name:     String,
  username: String,
  email:    String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;