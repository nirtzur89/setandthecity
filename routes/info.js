const express = require('express');
// const hbs = require('express-handlebars');
// const SpotifyWebApi = require('spotify-web-api-node');


const router = express.Router();

/* GET info page */
router.get('/', (req, res, next) => {
  console.log("INFO")
  res.render('info');
});


module.exports = router;