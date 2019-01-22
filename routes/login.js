const express = require('express');
const router  = express.Router();
const passport = require('passport');



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