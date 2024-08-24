const dotenv = require("dotenv").config();
const axios = require('axios')
const router = require('express').Router()

const key = process.env.GOOGLE_API_KEY;
module.exports = router

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
      const { locations, type, radius } = req.body;
  
      // Ensure locations array contains exactly two location objects
      if (locations.length !== 2) {
        return res.status(400).json({ error: 'Please provide exactly two locations.' });
      }
  
      const [location1, location2] = locations;
      const latMid = (location1.lat + location2.lat) / 2;
      const lngMid = (location1.lng + location2.lng) / 2;
  
      const language = 'en-US';
      const region = 'us';
  
      // Array to hold all places
      let allPlaces = [];
  
      // Loop through each type in the type array
      for (const singleType of type) {
        const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
          params: {
            location: `${latMid},${lngMid}`,
            radius: radius || 500, // Default radius if not provided
            type: singleType,
            language: language,
            region: region,
            key: process.env.GOOGLE_API_KEY,
            rankby: 'prominence',
          },
        });
  
        // Extract and format the places for the current type
        const places = data.results.map(place => ({
          displayName: place.name,
          location: place.geometry.location,
          businessStatus: place.business_status,
          type: singleType, // Include the type in the result
        }));
  
        // Combine places into the allPlaces array
        allPlaces = allPlaces.concat(places);
      }
  
      // Send all places back in the response
      res.json({ places: allPlaces });
    } catch (err) {
      next(err);
    }
  });
  