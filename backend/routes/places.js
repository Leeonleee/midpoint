const dotenv = require("dotenv").config();
const axios = require('axios')
const router = require('express').Router()
const example_itinerary = require('../example_itinerary.js')


const key = process.env.VITE_GOOGLE_API_KEY;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
module.exports = router

let startTime
let endTime

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

// Helper function to get place details
const getPlaceDetails = async (placeId) => {
    try {
      const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id: placeId,
          key: process.env.VITE_GOOGLE_API_KEY,
        },
      });
      return data.result; // Return detailed place information
    } catch (error) {
      console.error(`Failed to fetch details for place_id ${placeId}:`, error);
      return null;
    }
  };


  router.post('/suggestions', async (req, res, next) => {
    try {
      const { locations, type, radius, maxResultsPerType = 3 } = req.body;
      startTime = req.body.startTime
      endTime = req.body.endTime
  
      if (locations.length !== 2) {
        return res.status(400).json({ error: 'Please provide exactly two locations.' });
      }
  
      const [location1, location2] = locations;
      const latMid = (location1.lat + location2.lat) / 2;
      const lngMid = (location1.lng + location2.lng) / 2;
  
      const language = 'en-US';
      const region = 'us';
  
      let allPlaces = [];
  
      for (const singleType of type) {
        const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
          params: {
            location: `${latMid},${lngMid}`,
            radius: radius || 500,
            type: singleType,
            language: language,
            region: region,
            key: process.env.VITE_GOOGLE_API_KEY,
            rankby: 'prominence',
          },
        });
  
        const places = data.results.slice(0, maxResultsPerType).map(place => ({
          displayName: place.name,
          location: place.geometry.location,
          businessStatus: place.business_status,
          type: singleType,
        }));

    //     // Fetch details for each place
    //   const placesWithDetails = await Promise.all(
    //     data.results.slice(0, maxResultsPerType).map(async (place) => {
    //       const placeDetails = await getPlaceDetails(place.place_id);
    //       return {
    //         displayName: place.name,
    //         location: place.geometry.location,
    //         businessStatus: place.business_status,
    //         type: singleType,
    //         placeId: place.place_id,
    //         placeDetails: placeDetails, // Include detailed place info
    //       };
    //     })
    //   );
  
        allPlaces = allPlaces.concat(places);
      }

      res.json({ places: allPlaces });
    } catch (err) {
      next(err);
    }
  });
  
  

router.post('/gemini', async (req,res)=>{

    try{
        const request = req.body

        const prompt = `I have a current json file with places in the format here:
        ${JSON.stringify(request, null, 2)}

        Create an itinerary that is in between the start and end times given based on the following format.  The path between the locations should be efficient and in a logical manner. Only include the places in the json file above. Do not repeat places in the itinerary. Start time is ${startTime} and end time is ${endTime}. Only return the proposed json itinerary. Thanks :)

        ${example_itinerary}`;

        console.log(prompt)
        console.log('\n\n')
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text)
        const jsonString = text.match(/{[^]*}/)[0];
        const jsonObject = JSON.parse(jsonString);

        console.log(jsonObject);
        res.json(jsonObject);
    }
    catch(err){
        console.log(err);
        res.send("Unexpected Error!!!");
    }
}
)


