require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const User         = require('./models/user');
const path         = require('path');
const passport     = require('passport');
const bcrypt       = require('bcryptjs');
const SpotifyStrategy = require('passport-spotify').Strategy;

mongoose
  .connect('mongodb://localhost/204U', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
//Passport middleware configuration 

passport.serializeUser(  function(user, cb) { cb(null, user); });
passport.deserializeUser(function(obj,  cb) { cb(null, obj);  });

const client_id = 'a3676c8b791c49048c222a84f7fd770c';
const client_secret = '54708907189e407e8c5f6eb2328f9374';

var session = require ('express-session')
app.use(session({
  secret:"204u",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* GET personal Signup page */
// router.get('/', (req, res, next) => {
//   console.log("WE ARE AT LOGIN")
//   res.render('login');
// });

// passport-spotify auth
// passport.use(
//   new SpotifyStrategy(
//     {
//       clientID: client_id,
//       clientSecret: client_secret,
//       callbackURL: 'http://localhost:3000/auth/spotify/callback'
//     },
//     function(accessToken, refreshToken, expires_in, profile, done) {
//       User.find({ spotifyId: profile.id }, function(err, user) {
//         if (user === null) {
//           User.create({ spotifyId: profile.id }).then((user) => {
//             return done(err, user); 
//           })
//         } else {
//           return done(err, user); 
//         }
//       });
//     }
//   )
// );

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = '20-4-U';

// random comment

const home = require('./routes/home');
app.use('/', home);

const auth = require('./routes/auth');
app.use('/auth', auth);

const confirm = require('./routes/confirm');
app.use('/logincon', confirm);

const personalPage = require('./routes/personal');
app.use('/id', personalPage);

module.exports = app;
