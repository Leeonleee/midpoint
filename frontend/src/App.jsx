import { useEffect, useRef, useState } from "react";
import GoogleMapsAutocomplete from "./components/GoogleMapsAutocomplete";
import axios from "axios";
import FriendsBarComponent from "./components/FriendsBarComponent";
import ResultsDisplay from "./components/ResultsDisplay";
import './App.css';

const App = () => {
  const baseUrl = 'http://localhost:3001/api/suggestions';

  const [coordinates, setCoordinates] = useState({
    "locations": [
      { "lat": "", "lng": "" },
      { "lat": "", "lng": "" }
    ],
    "type": [],
    "radius": 500,
    "startTime": "",
    "endTime": "",
    "date": "",
  });

  const [response, setResponse] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  const [inputValues, setInputValues] = useState(["", ""]);

  const friends = [
    { name: "Alice", location: "1600 Amphitheatre Parkway, Mountain View, CA" },
    { name: "Bob", location: "1 Infinite Loop, Cupertino, CA" },
    { name: "Charlie", location: "350 5th Ave, New York, NY" },
  ];

  const handleSelectFriend = (friend) => {
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: friend.location }, (results, status) => {
      if (status === "OK") {
        const { lat, lng } = results[0].geometry.location;
        updateCoordinates(1, lat(), lng());
        setInputValues((values) => {
          const newValues = [...values];
          newValues[1] = friend.location;
          return newValues;
        });
      } else {
        console.error("Geocode was not successful for the following reason: " + status);
      }
    });
  };

  const updateCoordinates = (index, lat, lng) => {
    const newCoordinates = { ...coordinates };
    newCoordinates.locations[index] = { lat, lng };
    setCoordinates(newCoordinates);
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    let updatedTypes;
    if (checked) {
      updatedTypes = [...coordinates.type, value];
    } else {
      updatedTypes = coordinates.type.filter((type) => type !== value);
    }
    setCoordinates({ ...coordinates, type: updatedTypes });
  };

  const updateRadius = (e) => {
    const radius = parseInt(e.target.value, 10);
    setCoordinates({ ...coordinates, radius });
  };

  const handleStartTimeChange = (e) => {
    setCoordinates({ ...coordinates, startTime: e.target.value });
  };

  const handleEndTimeChange = (e) => {
    setCoordinates({ ...coordinates, endTime: e.target.value });
  };

  const handleDateChange = (e) => {
    setCoordinates({ ...coordinates, date: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(baseUrl, coordinates);
      console.log("Response: ", response.data);
      setResponse(response.data);
    } catch (error) {
      console.error("Error submitting coordinates: ", error);
    }
  };

  const isSubmitDisabled = () => {
    const { locations, type, radius, startTime, endTime, date } = coordinates;
    const allLocationsFilled = locations.every(coord => coord.lat && coord.lng);
    const allFieldsFilled = type.length > 0 && radius && startTime && endTime && date;
    return !(allLocationsFilled && allFieldsFilled);
  };

  const handleSelect = (result) => {
    setSelectedResult(result);
  };

  const handleCloseResults = () => {
    setResponse(null);
  };

  useEffect(() => {
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      // Handle the case where Google Maps API is not loaded yet
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
      script.onload = () => initializeMap();
      document.head.appendChild(script);
    }
  }, []);

  const initializeMap = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });

          new window.google.maps.Map(mapRef.current, {
            center: { lat: latitude, lng: longitude },
            zoom: 12,
          });
        },
        () => {
          const defaultCenter = { lat: -33.8688, lng: 151.2093 }; // Sydney coordinates
          setMapCenter(defaultCenter);

          new window.google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 12,
          });
        }
      );
    } else {
      const defaultCenter = { lat: -33.8688, lng: 151.2093 }; // Sydney coordinates
      setMapCenter(defaultCenter);

      new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
      });
    }
  };

  return (
    <div>
      <div className='header'>
        <img src="src/assets/header.png" alt="Midpoint Logo" />
      </div>
      <div id="container">
        <div id="sidebar">
          {response ? (
            <div id="results-display-container">
              <ResultsDisplay
                results={response.places || []}
                onSelect={handleSelect}
                onClose={handleCloseResults}
              />
            </div>
          ) : (
            <>
              <div id="autocomplete-bars">
                <label>My Location</label>
                <GoogleMapsAutocomplete
                  index={0}
                  updateCoordinates={updateCoordinates}
                  inputValue={inputValues[0]}
                  setInputValue={(value) => {
                    const newValues = [...inputValues];
                    newValues[0] = value;
                    setInputValues(newValues);
                  }}
                />
                <label>My Friend's Location</label>
                <GoogleMapsAutocomplete
                  index={1}
                  updateCoordinates={updateCoordinates}
                  inputValue={inputValues[1]}
                  setInputValue={(value) => {
                    const newValues = [...inputValues];
                    newValues[1] = value;
                    setInputValues(newValues);
                  }}
                />
              </div>
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
                    value="movie_theater"
                    onChange={handleTypeChange}
                    checked={coordinates.type.includes("movie_theater")}
                  />
                  Movie Theater
                </label>
              </div>
              <div>
                <label>
                  Start Time:
                  <input type="time" value={coordinates.startTime} onChange={handleStartTimeChange} />
                </label>
                <label>
                  End Time:
                  <input type="time" value={coordinates.endTime} onChange={handleEndTimeChange} />
                </label>
                <label>
                  Date:
                  <input type="date" value={coordinates.date} onChange={handleDateChange} />
                </label>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitDisabled()}
              >
                Submit
              </button>
            </>
          )}
        </div>
        <div id="map" ref={mapRef}></div>
        <FriendsBarComponent friends={friends} onSelectFriend={handleSelectFriend} />
      </div>
    </div>
  );
};

export default App;

