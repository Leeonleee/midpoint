const axios = require('axios')
const router = require('express').Router()
require('dotenv').config();
module.exports = router
const key = 'AIzaSyB_XZ2Q20yGdz-7wWgel1EaNv9Pw6vzgeY';
router.get('/restaurants', async (req, res, next) => {
 try {
   const neighborhood = 'chelsea'
   const borough = 'manhattan'
   const city = 'new+york+city'
   const category = 'burgers'
   const {data} = await axios.get(
   
`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${category}+${neighborhood}+${borough}+${city}&type=restaurant&key=${key}`
   )
   res.json(data)
   } 
 catch (err) {
  next(err)
}
})

router.get('/suggestions', async (req, res, next) => {
    try {

      const center = { lat: -33.891602606625575, lng: 151.1912928921235 };
      
  
      const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          location: `${center.lat},${center.lng}`,
          radius: radius,
          type: type,
          language: language,
          region: region,
          key: key,
          rankby: 'prominence', // To mimic rankPreference: SearchNearbyRankPreference.POPULARITY
        },
      });
  
      const places = data.results.slice(0, maxResults).map(place => ({
        displayName: place.name,
        location: place.geometry.location,
        businessStatus: place.business_status,
      }));
  
      res.json(places);
    } catch (err) {
      next(err);
    }
  });


  router.post('/suggestions', async (req, res, next) => {
    try {
      // Destructure the parameters from the request body
      const locations = req.body.locations;
      const [location1, location2] = locations;
    const latMid = (location1.lat + location2.lat) / 2;
    const lngMid = (location1.lng + location2.lng) / 2;


      const radius = 5000;
      const type = 'natural_feature';
      const maxResults = 5;
      const language = 'en-US';
      const region = 'us';
  
      const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          location: `${latMid},${lngMid}`,
          radius: radius,
          type: type,
          language: language,
          region: region,
          key: key,
          rankby: 'prominence', // To mimic rankPreference: SearchNearbyRankPreference.POPULARITY
        },
      });
  
      const places = data.results.slice(0, maxResults).map(place => ({
        displayName: place.name,
        location: place.geometry.location,
        businessStatus: place.business_status,
      }));
      
      console.log(places)
      res.json(places);
    } catch (err) {
      next(err);
    }
  });