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

spotifyApi.setAccessToken('BQDY6EZY4U3F_1QiEYVRGZrxWLqMLFSczXSYm9Xy5lCw');

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

  res.render('spotitest', {
    userName: userName,
    id: id
  })
});

module.exports = router;