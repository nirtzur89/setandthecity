const express = require('express');
const router  = express.Router();
const passport        = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const mongoose        = require('mongoose');
const User            = require('../models/user');
const SpotifyWebApi = require('spotify-web-api-node');

const client_id = 'a3676c8b791c49048c222a84f7fd770c';
const client_secret = '54708907189e407e8c5f6eb2328f9374';


//mongoose
mongoose
  .connect('mongodb://localhost/204U', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

//cookies
passport.serializeUser((user, done) =>{
  done(null, user.id);
});

passport.deserializeUser((id, done)=>{
  User.findById(id).then((user)=>{
    done(null, user);
  });
});

//passport strategy
passport.use(
  new SpotifyStrategy({
       clientID: client_id,
       clientSecret: client_secret,
       callbackURL: '/logincon'
    },(accessToken, refreshToken, expires_in, profile, done) => {
      
      User.findOne({spotifyId : profile._json.id})
      .then((currentUser) =>{
        if(currentUser){
          console.log('user ' + currentUser + ' already exists');
          done(null,currentUser);
          console.log(profile);
        } else {
          new User({
            username:  profile._json.display_name,
            email:     profile._json.email,
            spotifyId: profile._json.id,
            country:   profile._json.country,
            profile:   profile._json.profileUrl,
            photo:     profile._json.photos,
            //followedArtistsCount: profile._json. 
          }).save()
          .then((newUser) => {
            console.log('new user created' + newUser);
            done(null,newUser);
          })
        }})
      }));

      var scopes = ['user-read-private', 'user-read-email'],
  state = 'some-state-of-my-choice';



const redirectUri = '/logincon';


var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirectUri
});


// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

// https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
console.log(authorizeURL);

var credentials = {
  clientId: 'someClientId',
  clientSecret: 'someClientSecret',
  redirectUri: '/logincon'
};

var spotifyApi = new SpotifyWebApi(credentials);

// Retrieve an access token and a refresh token
spotifyApi.authorizationCodeGrant(authorizeURL).then(
  function (data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
  },
  function (err) {
    console.log('Something went wrong!', err);
  }
);

// clientId, clientSecret and refreshToken has been set on the api object previous to this call.
spotifyApi.refreshAccessToken().then(
  function (data) {
    console.log('The access token has been refreshed!');

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function (err) {
    console.log('Could not refresh access token', err);
  }
);

module.exports = router;