const express = require('express');
const hbs = require('express-handlebars');

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

  spotifyApi.setAccessToken(req.user.spotifyAccessToken);

  async function showFollowedArtists(id) {
    try {
      const user = await spotifyApi.getMe();
      console.log('USERuserUser', user)
      const artistlist = await spotifyApi.getFollowedArtists(user)
      .then(function (data) {
        console.log('what', data.body.artists.items[0].name);
        res.render('spotitest', {
          userName: data.body,
          id: id
        }); 
      })
      console.log('ARTISTLISTARTISTLIST', artistlist);
    } catch (err) {
      console.log('Error12345', err.message);
    }
  };

  showFollowedArtists()

  // spotifyApi.getMe()

  // spotifyApi.getFollowedArtists()


  // console.log(req.user.spotifyAccessToken)





});

module.exports = router;