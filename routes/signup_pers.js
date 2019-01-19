const express = require('express');
const router  = express.Router();

/* GET personal Signup page */
router.get('/signup_pers', (req, res, next) => {
  console.log('blablablablabla')
  res.send('Personal Signup Page');
});

module.exports = router;