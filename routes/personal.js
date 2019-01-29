const express = require('express');
const hbs = require('express-handlebars');

const SpotifyWebApi = require('spotify-web-api-node');
const client_id = 'a3676c8b791c49048c222a84f7fd770c';
const client_secret = '54708907189e407e8c5f6eb2328f9374';
var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret
  //redirectUri: redirectUri
});


const router = express.Router();

//checking if user is authorized
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('/')
  } else {
    next();
  }
};

//check if users already exists in our database

//route
router.get('/', authCheck, (req, res) => {
  //res.send("WE ARE AT YOUR PERSONAL 20 U 4 - WELCOME " + req.user.username);
  var userName = req.user.username;
  var id = req.user.spotifyId;

  spotifyApi.setAccessToken(req.user.spotifyAccessToken);

  function showFollowedArtists() {
    spotifyApi.getFollowedArtists(id)
      .then(function (data) {
        //console.log('what', data.body.artists.items)
        const following = data.body.artists.items

        let relatedArtists = []
        const reqs = following.map(function (item) {
          return spotifyApi.getArtistRelatedArtists(item.id)
            .then(function (data) {
              //console.log(data.body.artists)
              let relatedArtistArray = data.body.artists.map(x => x.name)
              relatedArtists.push(relatedArtistArray)

            }).then(function () {
              console.log('relateddddddddddddddddddddddddd', relatedArtists)
            })
          // .then(function(){
          //   let relatedTopFive = []
            // relatedArtists[1].forEach(function(id){
            //   spotifyApi.getArtistTopTracks(id, 'DE')
            //     .then(function(data) {
            //     console.log(data.body.name);
            //       }, function(err) {
            //     console.log('Something went wrong!', err);
            //     });
            //   })
          // })
        })

        Promise.all(reqs).then(() => {

          res.render('spotitest', {
            userName: userName,
            id: id,
            artistlist: following,
            relatedArtists: relatedArtists
          })
        })




      })
  };


  //var array1 = ['a', 'b', 'c'];
  // array1.forEach(function(element) {
  //   console.log(element);
  // });
  showFollowedArtists()

  // spotifyApi.getMe()

  // spotifyApi.getFollowedArtists()


  // console.log(req.user.spotifyAccessToken)





});

module.exports = router;