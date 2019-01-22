const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  console.log("WE ARE AT HOME")
  res.render('home');
});

module.exports = router;
