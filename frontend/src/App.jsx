import { useState } from "react";
import GoogleMapsAutocomplete from "./components/GoogleMapsAutocomplete"
import axios from "axios";

const App = () => {

  const baseUrl = 'http://localhost:3001/api/suggestions'
  
  const [coordinates, setCoordinates] = useState([
    { lat: "", lng: "" },
    { lat: "", lng: "" }
  ]);


  const updateCoordinates = (index, lat, lng) => {
    const newCoordinates = [...coordinates];
    newCoordinates[index] = { lat, lng };
    setCoordinates(newCoordinates);
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post(baseUrl, {
        coordinates
      });
      console.log("Response: ", response.data);
    } catch (error) {
      console.error("Error submitting coordinates: ", error);
    }
  }

  const isSubmitDisabled = coordinates.some(coord => !coord.lat || !coord.lng);

  return (
    <div>
      <GoogleMapsAutocomplete index={0} updateCoordinates={updateCoordinates}/>
      <h1>Hello</h1>
      <GoogleMapsAutocomplete index={1} updateCoordinates={updateCoordinates}/>
    
      {/* Display coordinates */}
      <pre>
        {JSON.stringify(coordinates, null, 2)}
      </pre>

      <button onClick={handleSubmit} disabled={isSubmitDisabled}>
        Submit
      </button>

    </div>
  )
}

export default App