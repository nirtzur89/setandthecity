require("dotenv").config();

const express = require('express');
const router = express.Router();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');


const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;


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

    console.log('accessToken', accessToken);
    console.log('profile', profile);
    
    User.findOne({
        spotifyId: profile._json.id
      })
      .then((currentUser) => {
        if (currentUser) {
          console.log('user already exists');
          currentUser.delete()
            .then(() => {
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
            })
          // done(null, currentUser);
        } else {
          console.log('new user to be created', {
            username: profile._json.display_name,
            email: profile._json.email,
            spotifyId: profile._json.id,
            spotifyAccessToken: accessToken,
            country: profile._json.country,
            profile: profile._json.profileUrl,
            photo: profile._json.photos,
            //followedArtistsCount: profile._json. 
          });
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



module.exports = router;