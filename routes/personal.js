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
  let userImage = []
  let relatedArtists = []
  let allTopTracks = []
  let randomImg = []
  // let followedArtistName = []
  let relatedArtistsImage = []
  let allFollowedArtists = [];
  

  spotifyApi.getMe()
  .then(function(data) {
    console.log('Some information about the authenticated user', data.body.images);
    userImage.push(data.body.images);
  }, function(err) {
    console.log('Something went wrong!', err);
  });


  spotifyApi.getFollowedArtists(id)
    .then(function (data) {
      //console.log('what', data.body.artists.items)
      randomArtistList1 = data.body.artists.items.sort(() => .5 - Math.random()).slice(0, 5);
      console.log('ID', data.body.artists.items)

      randomArtistList1.forEach(el => allFollowedArtists.push({
        id: el.id,
        name: el.name,
        image: el.images
      }));

      // randomArtistList1.forEach(el => randomImg.push(el.images));
      // randomArtistList1.forEach(el => followedArtistName.push(el.name))
      // console.log('artistIMG', randomImg);
      return Promise.all(randomArtistList1.map(function (item) {
        return spotifyApi.getArtistRelatedArtists(item.id)
      }))
    }).then((dataArr) => {
      //console.log(dataArr)

      let relatedArtistsId = []
      let mergedArtistsIds = []
  

      dataArr.forEach((data) => {
        let randomRelatedArtists = data.body.artists.sort(() => .4 - Math.random()).slice(0, 4);
        // console.log('line 49', randomRelatedArtists[0].images)

        let relatedArtistIdArray = randomRelatedArtists.map(x => x.id)
        relatedArtistsId.push(relatedArtistIdArray)
        let relatedArtistArray = randomRelatedArtists.map(x => x.name)
        relatedArtists.push(relatedArtistArray)
        let relatedArtistImageArray = randomRelatedArtists.map(x => x.images)
        relatedArtistsImage.push(relatedArtistImageArray)
        //console.log('line 74', relatedArtistArray)
        // console.log('line 75', relatedArtistsImage[0])

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
          image: artist.body.tracks[selectedTop].album.images[0].url,
          preview: artist.body.tracks[selectedTop].preview_url,
          link: artist.body.tracks[selectedTop].id,
          artistPageLink: artist.body.tracks[selectedTop].artists[0].id
        }
        allTopTracks.push(finalTracks);
      })

      console.log('artistOBJECT', allFollowedArtists)

      res.render('spotitest', {
        userName: userName,
        id: id,
        userImage: userImage[0][0],
        artistlist: randomArtistList1,
        // followedArtistName: followedArtistName,
        allFollowedArtists: allFollowedArtists,
        relatedArtists: relatedArtists,
        relatedArtistsImage: relatedArtistsImage,
        relatedTop: allTopTracks,
        artistImage: randomImg,
      })
    });


});
module.exports = router;