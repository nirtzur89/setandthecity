require("dotenv").config();

const express = require('express');
const hbs = require('express-handlebars');
const SpotifyWebApi = require('spotify-web-api-node');


const client_id     = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret
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


//route
router.get('/', authCheck, (req, res) => {
  //res.send("WE ARE AT YOUR PERSONAL 20 U 4 - WELCOME " + req.user.username);

  var userName = req.user.username;
  // console.log('userimage', userImage);
  var id = req.user.spotifyId;

  spotifyApi.setAccessToken(req.user.spotifyAccessToken);
  let randomArtistList1 = []
  let relatedArtists = []
  let allTopTracks = []
  let randomImg = []

  spotifyApi.getMe()
  .then(function(data) {
    console.log('Some information about the authenticated user', data.body.images);
  }, function(err) {
    console.log('Something went wrong!', err);
  });


  spotifyApi.getFollowedArtists(id)
    .then(function (data) {
      //console.log('what', data.body.artists.items)
      randomArtistList1 = data.body.artists.items.sort(() => .5 - Math.random()).slice(0, 5);
      randomArtistList1.forEach(el => randomImg.push(el.images));
      // console.log('artistIMG', randomImg);
      return Promise.all(randomArtistList1.map(function (item) {
        return spotifyApi.getArtistRelatedArtists(item.id)
      }))
    }).then((dataArr) => {
      //console.log(dataArr)

      let relatedArtistsId = []
      let mergedArtistsIds = []
      let relatedArtistsImage = []

      dataArr.forEach((data) => {
        let randomRelatedArtists = data.body.artists.sort(() => .4 - Math.random()).slice(0, 4);
        // console.log('line 49', randomRelatedArtists[0].images)

        let relatedArtistIdArray = randomRelatedArtists.map(x => x.id)
        relatedArtistsId.push(relatedArtistIdArray)
        let relatedArtistArray = randomRelatedArtists.map(x => x.name)
        relatedArtists.push(relatedArtistArray)
        let relatedArtistImageArray = randomRelatedArtists.map(x => x.images)
        relatedArtistsImage.push(relatedArtistImageArray)
        console.log('line 74', relatedArtistArray)
        console.log('line 75', relatedArtistsImage[0])

        mergedArtistsIds = [].concat.apply([], relatedArtistsId);
        //console.log('line 66', mergedArtistsIds)
      })
      return Promise.all(mergedArtistsIds.map(function (id) {
        return spotifyApi.getArtistTopTracks(id, 'DE')
      }))
    }).then((dataArr) => {


      dataArr.forEach((artist) => {
        let selectedTop = Math.floor(Math.random() * artist.body.tracks.length);
        // console.log('track', artist.body.tracks[selectedTop])
        let finalTracks = {
          track: artist.body.tracks[selectedTop].name,
          artist: artist.body.tracks[selectedTop].artists[0].name,
          image: artist.body.tracks[selectedTop].album.images[0].url
        }
        allTopTracks.push(finalTracks);
      })

      res.render('spotitest', {
        userName: userName,
        id: id,
        artistlist: randomArtistList1,
        relatedArtists: relatedArtists,
        relatedTop: allTopTracks,
        artistImage: randomImg
      })
    });


});
module.exports = router;