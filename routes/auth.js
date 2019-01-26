const express = require('express');
const hbs = require('express-handlebars');
const User = require('../models/user');

const SpotifyWebApi = require('spotify-web-api-node');
const client_id = 'a3676c8b791c49048c222a84f7fd770c';
const client_secret = '54708907189e407e8c5f6eb2328f9374';
var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret
  //redirectUri: redirectUri
});


const router = express.Router();

//checking if user is authorized
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('/')
  } else {
    next();
  }
};

//check if users already exists in our database

//route
router.get('/', authCheck, (req, res) => {
  //res.send("WE ARE AT YOUR PERSONAL 20 U 4 - WELCOME " + req.user.username);
  var userName = req.user.username;
  var id = req.user.spotifyId;

  spotifyApi.setAccessToken(req.user.spotifyAccessToken)
  
  var getFollowedArtists = spotifyApi.getFollowedArtists()
  .then(function(data) {
    var followedArtists = [] 
    for (let i = 0; data.body.artists.items.lengt<i; i++){
      followedArtists.push(data.body.artists.items[i])
    }
  console.log(followedArtists);
  }, function(err) {
  console.log('Something went wrong!', err);
  });

  getFollowedArtists.then(function() {
      res.render('spotitest', {
        userName: userName,
        followedArtists: getFollowedArtists,
        id: id
      })
    })
  
  
  });




module.exports = router;