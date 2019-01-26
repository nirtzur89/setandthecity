const express = require('express');
const router  = express.Router();
const passport        = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const mongoose        = require('mongoose');
const User            = require('../models/user');
const SpotifyWebApi = require('spotify-web-api-node');

const client_id = 'a3676c8b791c49048c222a84f7fd770c';
const client_id2 = 'daaf597517cb41bd84f0981584dbbc18';
const client_secret = '54708907189e407e8c5f6eb2328f9374';
const client_secret2 = 'd6fd4f5a4e3b40a685f4dde2a6058099';


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
       clientID: client_id2,
       clientSecret: client_secret2,
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

      module.exports = router;