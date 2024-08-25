import React, { useState, useEffect, useRef } from "react";
import { StandaloneSearchBox } from "@react-google-maps/api";

const GoogleMapsAutocomplete = ({ index, updateCoordinates, value }) => {
  const [searchBox, setSearchBox] = useState(null);
  const [inputValue, setInputValue] = useState(value || '');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const hasUpdatedRef = useRef(false); // Use a ref to avoid infinite loop

  useEffect(() => {
    // Update inputValue if the value prop changes
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    if (selectedPlace && !hasUpdatedRef.current) {
      // Update coordinates only if the selectedPlace changes and it's not a reset
      updateCoordinates(index, selectedPlace.lat, selectedPlace.lng);
      hasUpdatedRef.current = true; // Set ref to true to prevent further updates
    }
  }, [selectedPlace, index, updateCoordinates]);

  const onLoad = (ref) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    if (places.length === 0) {
      return;
    }

    const place = places[0];
    const location = place.geometry?.location;

    if (location) {
      const lat = location.lat();
      const lng = location.lng();
      setInputValue(place.address); // Update inputValue to show the selected place
      setSelectedPlace({ lat, lng, address: place.address });
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    setSelectedPlace(null); // Reset selected place when user types
    hasUpdatedRef.current = false; // Allow updates when the user types
  };

  return (
    <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
      <input
        type="text"
        placeholder="Search places..."
        value={inputValue}
        onChange={handleChange}
        style={{
          boxSizing: "border-box",
          border: "1px solid #ddd",
          width: "100%",
          height: "40px",
          padding: "0 12px",
          borderRadius: "5px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
          fontSize: "14px",
          outline: "none",
          marginBottom: "1rem", // You can remove or adjust this if needed
        }}
      />
    </StandaloneSearchBox>
  );
};

export default GoogleMapsAutocomplete;
