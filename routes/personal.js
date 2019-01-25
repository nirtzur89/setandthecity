const express = require('express');
const hbs = require('express-handlebars');
const SpotifyWebApi = require('spotify-web-api-node');

const router = express.Router();

const client_id = 'a3676c8b791c49048c222a84f7fd770c';
const client_id2 = 'daaf597517cb41bd84f0981584dbbc18';
const client_secret = '54708907189e407e8c5f6eb2328f9374';
const client_secret2 = 'd6fd4f5a4e3b40a685f4dde2a6058099';

var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: '/logincon'
});

spotifyApi.setAccessToken('BQCpCOFIfrtgbDw-WCuzmhosBnIGoKBOb-SslrwzSfo5MN934My48yhpcoT-MFI9M6y9l5Ku1JR2psAjkxl8Vhfwy-CMAWzncunqZdhw3wuTfbRY0LukRXldoTXkiMP509gYd85chjsjISF7Df7oVARdWNvTS9GD1zF8PeHrdHpcICD9VsWo3AIFqcuFRwWRWDMUatqEF3s2_aHhcu92et_Fb-LShnjp5QLL-zg5OhT5nxC3JfSPtoCRVCBy4MonJ1c48WQn73C0i3AoxpTCfZvR6ZElRihhpCjPQLM');

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

  var followedArtists = [];
  // req.user.followedArtists = spotifyApi.getFollowedArtists() 

  // .then(function (data) {
  //   // 'This user is following 1051 artists!'
  //   console.log('This user is following ', data.body.artists, ' artists!');
  // }, function (err) {
  //   console.log('Something went wrong!', err);
  // })

  res.render('spotitest', {
    userName: userName,
    id: id,
    // followedArtists: followedArtists
  })
});



//  spotifyApi.getUserPlaylists('yearsandyears')
//  .then(function(data) {
//    console.log('Retrieved playlists', data.body);
//  },function(err) {
//    console.log('Something went wrong!', err);
//  });

// });

module.exports = router;