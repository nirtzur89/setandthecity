const express = require('express');
const hbs = require('express-handlebars');
const SpotifyWebApi = require('spotify-web-api-node');

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

  res.render('spotitest', {
    userName: userName,
    id: id
  })
});

module.exports = router;