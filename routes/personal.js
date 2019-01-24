const express    = require('express');
const hbs        = require('express-handlebars');
const SpotifyWebApi = require('spotify-web-api-node');

const router  = express.Router();

const client_id = 'a3676c8b791c49048c222a84f7fd770c';
const client_id2 = 'daaf597517cb41bd84f0981584dbbc18';
const client_secret = '54708907189e407e8c5f6eb2328f9374';
const client_secret2 = 'd6fd4f5a4e3b40a685f4dde2a6058099';

var spotifyApi = new SpotifyWebApi({
  clientId: client_id2,
  clientSecret: client_secret2,
  redirectUri: '/logincon'
});

spotifyApi.setAccessToken('BQCw-mQMftEzahCTs4gY8zpDx2V6ujVIde033Qmq9XzBM96lAmO7eRzkDiSb_pYG3YhPj8hoyM_eqlHirq9HrKCx6j3g0uJem3O3Ohuv1v-xswESGigsPqAUUB8O2amQ8vuvupX85iv6w2LOKTCxDGsiq5BvAQKQymra9SXAatnnvrpih3mQfJ6lIAFBOcOudHPCWmcDMrr3CtRg4GiAHf4G4rx_taKRAMbWzCiii3DxhfMvClp-ecKsi1z5NxIi067pzlTrJNgpIApybjj6Ir-XQffH5dvm4IL-yWU');

//checking if user is authorized
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
  var userName = req.user.username;
  var id = req.user.spotifyId;

  res.render('spotitest',{userName:userName , id:id})

   spotifyApi.getFollowedArtists(userName)
   .then(function(data) {
     console.log('This user is following ', data.body.artists, ' artists!');
   }, function(err) {
     console.log('Something went wrong!', err);
   });

  //  spotifyApi.getUserPlaylists('yearsandyears')
  //  .then(function(data) {
  //    console.log('Retrieved playlists', data.body);
  //  },function(err) {
  //    console.log('Something went wrong!', err);
  //  });

 });

module.exports = router;