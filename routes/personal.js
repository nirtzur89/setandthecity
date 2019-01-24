const express = require('express');
const router  = express.Router();

const authCheck = (req,res,next) => {
  if(!req.user){
    res.redirect('/')
  }else{
    next();
  }
};

router.get('/', authCheck ,(req, res, next) => {
  res.send("WE ARE AT YOUR PERSONAL 20 U 4 - WELCOME " + req.user);
  
});

module.exports = router;