import { useState } from "react";
import GoogleMapsAutocomplete from "./components/GoogleMapsAutocomplete";
import axios from "axios";
import './App.css'; // Import your CSS file

const App = () => {
  const baseUrl = 'http://localhost:3001/api/suggestions';

  const [coordinates, setCoordinates] = useState({
    "locations": [
      { "lat": "", "lng": "" },
      { "lat": "", "lng": "" }
    ],
    "type": [],
    "radius": 500 // Default radius is 500
  });

  // Function to update coordinates
  const updateCoordinates = (index, lat, lng) => {
    const newCoordinates = { ...coordinates };
    newCoordinates.locations[index] = { lat, lng };
    setCoordinates(newCoordinates);
  };

  // Function to handle checkbox changes
  const handleTypeChange = (e) => {
    const { value, checked } = e.target;

    let updatedTypes;
    if (checked) {
      // Add type if checked
      updatedTypes = [...coordinates.type, value];
    } else {
      // Remove type if unchecked
      updatedTypes = coordinates.type.filter((type) => type !== value);
    }

    setCoordinates({ ...coordinates, type: updatedTypes });
  };

  // Function to update radius from dropdown
  const updateRadius = (e) => {
    const radius = parseInt(e.target.value, 10);
    setCoordinates({ ...coordinates, radius });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(baseUrl, coordinates);
      console.log("Response: ", response.data);
    } catch (error) {
      console.error("Error submitting coordinates: ", error);
    }
  };

  const isSubmitDisabled = coordinates.locations.some(coord => !coord.lat || !coord.lng);

  return (
    <div>
      <GoogleMapsAutocomplete index={0} updateCoordinates={updateCoordinates} />
      <h1>Hello</h1>
      <GoogleMapsAutocomplete index={1} updateCoordinates={updateCoordinates} />

      {/* Dropdown menu for selecting radius */}
      <div>
        <label>
          Radius (m):
          <select value={coordinates.radius} onChange={updateRadius}>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
            <option value={2000}>2000</option>
            <option value={5000}>5000</option>
          </select>
        </label>
      </div>

      {/* Checkbox menu for selecting types */}
      <div>
        <label>
          <input
            type="checkbox"
            value="restaurant"
            onChange={handleTypeChange}
            checked={coordinates.type.includes("restaurant")}
          />
          Restaurant
        </label>
        <label>
          <input
            type="checkbox"
            value="amusement_park"
            onChange={handleTypeChange}
            checked={coordinates.type.includes("amusement_park")}
          />
          Amusement Park
        </label>
        <label>
          <input
            type="checkbox"
            value="art_gallery"
            onChange={handleTypeChange}
            checked={coordinates.type.includes("art_gallery")}
          />
          Art Gallery
        </label>
        <label>
          <input
            type="checkbox"
            value="cafe"
            onChange={handleTypeChange}
            checked={coordinates.type.includes("cafe")}
          />
          Cafe
        </label>
        <label>
          <input
            type="checkbox"
            value="gym"
            onChange={handleTypeChange}
            checked={coordinates.type.includes("gym")}
          />
          Gym
        </label>
        <label>
          <input
            type="checkbox"
            value="bar"
            onChange={handleTypeChange}
            checked={coordinates.type.includes("bar")}
          />
          Bar
        </label>
        <label>
          <input
            type="checkbox"
            value="library"
            onChange={handleTypeChange}
            checked={coordinates.type.includes("library")}
          />
          Library
        </label>
        <label>
          <input
            type="checkbox"
            value="movie_theatre"
            onChange={handleTypeChange}
            checked={coordinates.type.includes("movie_theatre")}
          />
          Movie Theatre
        </label>
        <label>
          <input
            type="checkbox"
            value="museum"
            onChange={handleTypeChange}
            checked={coordinates.type.includes("museum")}
          />
          Museum
        </label>
        <label>
          <input
            type="checkbox"
            value="tourist_attraction"
            onChange={handleTypeChange}
            checked={coordinates.type.includes("tourist_attraction")}
          />
          Tourist Attraction
        </label>
      </div>

      {/* Display coordinates */}
      <pre>
        {JSON.stringify(coordinates, null, 2)}
      </pre>

      <button onClick={handleSubmit} disabled={isSubmitDisabled}>
        Submit
      </button>
    </div>
  );
};

export default App;
