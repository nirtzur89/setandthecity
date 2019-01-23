const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  console.log("WE ARE AT confirm")
  res.send('user confirmd');
});

module.exports = router;
