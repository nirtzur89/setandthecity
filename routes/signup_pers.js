const express = require('express');
const router  = express.Router();

/* GET personal Signup page */
router.get('/signup', (req, res, next) => {
  res.send('Personal Signup Page');
});

module.exports = router;