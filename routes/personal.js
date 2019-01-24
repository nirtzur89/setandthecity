const express = require('express');
const hbs     = require('express-handlebars');

const router  = express.Router();

// //hbs properties
// var userhbs = hbs.create({
//   // Specify helpers which are only registered on this instance.
//   helpers: {
//       username: function () { return req.user.username; },
//       bar: function () { return 'BAR!'; }
//   }
// });


//checkin if user is authorized
const authCheck = (req,res,next) => {
  if(!req.user){
    res.redirect('/')
  }else{
    next();
  }
};

//route
router.get('/', authCheck ,(req, res) => {
  //res.send("WE ARE AT YOUR PERSONAL 20 U 4 - WELCOME " + req.user.username);
  var userName = req.user.username
  
  
  res.render('personal',{userName:userName})
});

module.exports = router;