const express = require('express');
const hbs = require('express-handlebars');
const SpotifyWebApi = require('spotify-web-api-node');

require("dotenv").config();
const client_id = process.env.SPOTIFY_CLIENT_ID;
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
  var id = req.user.spotifyId;
  var artistlist = req.user.artistlist;

  spotifyApi.setAccessToken(req.user.spotifyAccessToken);
  let randomArtistList1 = []
  let relatedArtists = []
  let allTopTracks = []
  let randomImg = []

  spotifyApi.getFollowedArtists(id)
    .then(function (data) {
      //console.log('what', data.body.artists.items)
      randomArtistList1 = data.body.artists.items.sort(() => .5 - Math.random()).slice(0, 5);
      randomArtistList1.forEach(el => randomImg.push(el.images));
      console.log('artistIMG', randomImg);
      return Promise.all(randomArtistList1.map(function (item) {
        return spotifyApi.getArtistRelatedArtists(item.id)
      }))
    }).then((dataArr) => {
      //console.log(dataArr)
      let relatedArtistsId = []
      let mergedArtistsIds = []
      dataArr.forEach((data) => {
        let randomRelatedArtists = data.body.artists.sort(() => .4 - Math.random()).slice(0, 4);
        //console.log('line 49', randomRelatedArtists)
        let relatedArtistIdArray = randomRelatedArtists.map(x => x.id)
        relatedArtistsId.push(relatedArtistIdArray)
        let relatedArtistArray = randomRelatedArtists.map(x => x.name)
        relatedArtists.push(relatedArtistArray)
        mergedArtistsIds = [].concat.apply([], relatedArtistsId);
        //console.log('line 66', mergedArtistsIds)
      })
      return Promise.all(mergedArtistsIds.map(function (id) {
        return spotifyApi.getArtistTopTracks(id, 'DE')
      }))
    }).then((dataArr) => {


      dataArr.forEach((artist) => {
        let selectedTop = Math.floor(Math.random() * artist.body.tracks.length);
        console.log('track', artist.body.tracks[selectedTop].name)
        allTopTracks.push(artist.body.tracks[selectedTop].name)
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