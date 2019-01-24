const express = require('express');
const router  = express.Router();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User         = require('../models/user');

passport.serializeUser(  function(user, cb) { cb(null, user); });
passport.deserializeUser(function(obj,  cb) { cb(null, obj);  });



router.use(passport.initialize());
router.use(passport.session());

var session = require ('express-session')
router.use(session({
  secret:"204u",
  resave: false,
  saveUninitialized: false
}));



// router.get('/login', function(req, res) {
//   var scopes = 'user-read-private user-read-email';
//   res.redirect('https://accounts.spotify.com/authorize' +
//    '?response_type=code' +
//    '&client_id=' + my_client_id +
//    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
//    '&redirect_uri=' + encodeURIComponent(redirect_uri));
//   });

module.exports = router;