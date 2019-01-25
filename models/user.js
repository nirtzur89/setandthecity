const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  token: String,
  spotifyId: String,
  followedArtistsCount: Number,
  followedArtists: [{
    artistId: String,
    artistName: String,
    relatedArtists: [{
      artistId: String,
      artistName: String,
      tracks: [{
        trackId: String,
        popularity: Number,
        artistName: String,
        trackName: String,
        url: String,
      }]
    }]
  }],
});


const User = mongoose.model('User', UserSchema);


module.exports = User;