const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  console.log("WE ARE AT PERSONAL")
  res.send('blablabla');
});

module.exports = router;