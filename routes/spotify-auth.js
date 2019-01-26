const express = require('express');
const router = express.Router();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');

const client_id = 'a3676c8b791c49048c222a84f7fd770c';
const client_secret = '54708907189e407e8c5f6eb2328f9374';


//cookies
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

//passport strategy
passport.use(
  new SpotifyStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: '/logincon'
  }, (accessToken, refreshToken, expires_in, profile, done) => {

    User.findOne({
        spotifyId: profile._json.id
      })
      .then((currentUser) => {
        if (currentUser) {
          console.log('user already exists');
          done(null, currentUser);

        } else {
          new User({
              username: profile._json.display_name,
              email: profile._json.email,
              spotifyId: profile._json.id,
              spotifyAccessToken: accessToken,
              country: profile._json.country,
              profile: profile._json.profileUrl,
              photo: profile._json.photos,
              //followedArtistsCount: profile._json. 
            }).save()
            .then((newUser) => {
              console.log('new user created' + newUser);
              done(null, newUser);
            })
        }
      })
  }));








// // Retrieve an access token and a refresh token
// spotifyApi.authorizationCodeGrant(authorizeURL).then(
//   function (data) {
//     console.log('The token expires in ' + data.body['expires_in']);
//     console.log('The access token is ' + data.body['access_token']);
//     console.log('The refresh token is ' + data.body['refresh_token']);

//     // Set the access token on the API object to use it in later calls
//     spotifyApi.setAccessToken(data.body['access_token']);
//     // spotifyApi.setRefreshToken(data.body['refresh_token']);
//     console.log('access token SET')
//   },
//   function (err) {
//     console.log('Something went wrong!', err);
//   }
// );



// clientId, clientSecret and refreshToken has been set on the api object previous to this call.
// spotifyApi.refreshAccessToken().then(
//   function (data) {
//     console.log('The access token has been refreshed!');

//     // Save the access token so that it's used in future calls
//     spotifyApi.setAccessToken(data.body['access_token']);
//   },
//   function (err) {
//     console.log('Could not refresh access token', err);
//   }
// );

module.exports = router;