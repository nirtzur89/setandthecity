const express = require('express');
const router  = express.Router();
const passport = require('passport')

/* GET home page */
router.get('/', (req, res, next) => {
  console.log("WE ARE AT HOME")
  res.render('home');
});

router.get('/auth', passport.authenticate('spotify', {
  scope: ['user-read-email','user-read-private'],
  showDialog: true
}),
function(req, res) {
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
});

router.get('/logincon', passport.authenticate('spotify', { failureRedirect: '/' }),(req,res) =>{
  //res.send(req.user);
  res.redirect('/personal')
});



module.exports = router;
