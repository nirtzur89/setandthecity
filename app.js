require('dotenv').config();

const bodyParser      = require('body-parser');
const cookieParser    = require('cookie-parser');
const express         = require('express');
const favicon         = require('serve-favicon');
const hbs             = require('express-handlebars');
const mongoose        = require('mongoose');
const logger          = require('morgan');
const path            = require('path');
const cookieSession   = require('cookie-session');

const passportSetup   = require('./routes/spotify-auth')

const User            = require('./models/user');
const passport        = require('passport');
const bcrypt          = require('bcryptjs');
const SpotifyStrategy = require('passport-spotify').Strategy;
const Spotify         = require('spotify-web-api-js');

//mongoose
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


// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys:['awsomethree']
}))

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
app.engine('hbs', hbs({extname: 'hbs', defaultLayout:'layout' , layoutsDir: __dirname + '/views'}))
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

const personalPage = require('./routes/personal');
app.use('/personal', personalPage);

module.exports = app;
