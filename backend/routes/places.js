const axios = require('axios')
const router = require('express').Router()
require('dotenv').config();
module.exports = router
const key = 'key';
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
      const center = { lat: 52.369358, lng: 4.889258 };
      const radius = 500;
      const type = 'restaurant';
      const maxResults = 5;
      const language = 'en-US';
      const region = 'us';
  
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