const express = require('express');
const router  = express.Router();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

passport.serializeUser(  function(user, cb) { cb(null, user); });
passport.deserializeUser(function(obj,  cb) { cb(null, obj);  });

const client_id = 'a3676c8b791c49048c222a84f7fd770c';
const client_secret = '54708907189e407e8c5f6eb2328f9374';

/* GET personal Signup page */
// router.get('/', (req, res, next) => {
//   console.log("WE ARE AT LOGIN")
//   res.render('login');
// });

// passport-spotify auth
passport.use(
  new SpotifyStrategy(
    {
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: 'http://127.0.0.1:3000/auth/spotify/callback'
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
  secret:"204u"
}));

router.get('/', passport.authenticate('spotify'), function(req, res) {
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
});

router.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
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