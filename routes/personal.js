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

      let selectedTop = Math.floor(Math.random() * Math.floor(9));
      dataArr.forEach((artist) => {
        if (artist.body.tracks[selectedTop].name !== undefined) {
          console.log('track', artist.body.tracks[selectedTop].name)
          allTopTracks.push(artist.body.tracks[selectedTop].name)
        } else {
          allTopTracks.push(artist.body.tracks[0].name)
        }
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