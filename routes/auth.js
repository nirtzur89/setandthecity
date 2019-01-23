const express = require('express');
const router  = express.Router();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User         = require('../models/user');

passport.serializeUser(  function(user, cb) { cb(null, user); });
passport.deserializeUser(function(obj,  cb) { cb(null, obj);  });

const client_id = 'a3676c8b791c49048c222a84f7fd770c';
const client_id2 = 'daaf597517cb41bd84f0981584dbbc18';
const client_secret = '54708907189e407e8c5f6eb2328f9374';
const client_secret2 = 'd6fd4f5a4e3b40a685f4dde2a6058099';


// passport-spotify auth
passport.use(
  new SpotifyStrategy(
    {
       clientID: client_id2,
       clientSecret: client_secret2,
       callbackURL: '/logincon'
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      User.find({ spotifyId: profile.id }, function(err, user) {
        if (user === null) {
          User.create({ spotifyId: profile.id }).then((user) => {
            return done(err, user); 
          })
        } else {
          return done(err, user); 
        }
      });
    }
  )
);

router.use(passport.initialize());
router.use(passport.session());

var session = require ('express-session')
router.use(session({
  secret:"204u",
  resave: false,
  saveUninitialized: false
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get('/', passport.authenticate('spotify', {
  scope: ['user-read-email','user-read-private'],
  showDialog: true
}),
function(req, res) {
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
});

router.get('/logincon', (req,res) =>{
  res.send('hello new user');
});

  router.get(
    '/auth',
    passport.authenticate('spotify', { 
      //successRedirect:'/id',
      failureRedirect: '/auth' }),
    function(req, res) {
      console.log('in post')
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );

// router.get('/login', function(req, res) {
//   var scopes = 'user-read-private user-read-email';
//   res.redirect('https://accounts.spotify.com/authorize' +
//    '?response_type=code' +
//    '&client_id=' + my_client_id +
//    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
//    '&redirect_uri=' + encodeURIComponent(redirect_uri));
//   });

module.exports = router;