import React, { useState } from "react";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";

const libraries = ["places"];

const GoogleMapsAutocomplete = ({ index, updateCoordinates }) => {
  const [searchBox, setSearchBox] = useState(null);

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

      updateCoordinates(index, lat, lng);
    }

    // setPlaces(places);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAm5kT1IDGddzTnpecUx06IryFaR7-cEOo" libraries={libraries}>
      <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
        <input
          type="text"
          placeholder="Search places..."
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
    </LoadScript>
  );
};

export default GoogleMapsAutocomplete;
