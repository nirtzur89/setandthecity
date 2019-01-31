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


  function showFollowedArtists() {
    spotifyApi.getFollowedArtists(id)
      .then(function (data) {
        //console.log('what', data.body.artists.items)
        let randomArtistList1 = data.body.artists.items.sort(() => .5 - Math.random()).slice(0,5);

        let relatedArtists = []
        let relatedArtistsId = []
        const reqs = randomArtistList1.map(function (item) {
          return spotifyApi.getArtistRelatedArtists(item.id)
            .then(function (data) {
              let randomRelatedArtists = data.body.artists.sort(() => .3 - Math.random()).slice(0,3);
              console.log('line 49',randomRelatedArtists)
              let relatedArtistIdArray = randomRelatedArtists.map(x => x.id)
              relatedArtistsId.push(relatedArtistIdArray)
              let relatedArtistArray = randomRelatedArtists.map(x => x.name)
              relatedArtists.push(relatedArtistArray)
              return relatedArtistsId
            })
              .then(function(data){
                var mergedArtistsIds = [].concat.apply([], data);
                console.log('line 58',mergedArtistsIds)
                    let allTopTracks=[]
                      mergedArtistsIds.forEach(function(id){
                      spotifyApi.getArtistTopTracks(id, 'DE')
                      .then(function(data){
                        allTopTracks.push(data);
                      })
                    })
                      console.log('alltops', allTopTracks)
                      // let randomTop = []
                      // console.log('mergedrelatedddddddddddtoptracks', data)
                      // //mergedTop.forEach(function(el))
                      // let allRelated = mergedTop.body.tracks
                      // let randomTop = allRelated.sort(() => .2 - Math.random()).slice(0,3);
                      //   console.log('random top',randomTop)
                      // let randomTopArray = randomTop.map(x => x.name)
                      //   relatedTop.push(randomTopArray)
                    }), function(err) {
                      console.log('Something went wrong!', err);
          }});

        Promise.all(reqs).then(() => {
          res.render('spotitest', {
            userName: userName,
            id: id,
            artistlist: randomArtistList1,
            relatedArtists: relatedArtists
            // relatedTop: randomTop
          })
        })




      })

  };
  
  // res.render('spotitest', {
  //   userName: userName,
  //   id: id,
  //   // artistlist: artistlist
  // })


  //var array1 = ['a', 'b', 'c'];
  // array1.forEach(function(element) {
  //   console.log(element);
  // // });
  showFollowedArtists()
  // console.log('probably UNDEFINED', artistlist);

});

module.exports = router;