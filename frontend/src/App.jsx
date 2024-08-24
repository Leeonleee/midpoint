import React, { useEffect, useRef } from 'react';
import './App.css'; // Import your CSS file
import GoogleMapComponent from "./GoogleMapComponent";


function App() {
  const mapRef = useRef(null);
  const requestRef = useRef(null);
  const responseRef = useRef(null);
  const markersArray = useRef([]);

  useEffect(() => {
    function initMap() {
      const bounds = new google.maps.LatLngBounds();
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 55.53, lng: 9.4 },
        zoom: 10,
        // mapId:
      });

      const geocoder = new google.maps.Geocoder();
      const service = new google.maps.DistanceMatrixService();

      const origin1 = { lat: 55.93, lng: -3.118 };
      const origin2 = "Greenwich, England";
      const destinationA = "Stockholm, Sweden";
      const destinationB = { lat: 50.087, lng: 14.421 };
      const request = {
        origins: [origin1, origin2],
        destinations: [destinationA, destinationB],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      };

      if (requestRef.current) {
        requestRef.current.innerText = JSON.stringify(request, null, 2);
      }

      service.getDistanceMatrix(request).then((response) => {
        if (responseRef.current) {
          responseRef.current.innerText = JSON.stringify(response, null, 2);
        }

        const originList = response.originAddresses;
        const destinationList = response.destinationAddresses;

        deleteMarkers();

        const showGeocodedAddressOnMap = (asDestination) => {
          return ({ results }) => {
            const position = results[0].geometry.location;
            map.fitBounds(bounds.extend(position));

            const marker = new google.maps.marker.AdvancedMarkerElement({
              map,
              position,
              content: asDestination ? "D" : "O",
            });

            markersArray.current.push(marker);
          };
        };

        for (let i = 0; i < originList.length; i++) {
          const results = response.rows[i].elements;

          geocoder
            .geocode({ address: originList[i] })
            .then(showGeocodedAddressOnMap(false));

          for (let j = 0; j < results.length; j++) {
            geocoder
              .geocode({ address: destinationList[j] })
              .then(showGeocodedAddressOnMap(true));
          }
        }
      });
    }

    function deleteMarkers() {
      markersArray.current.forEach(marker => marker.map = null);
      markersArray.current = [];
    }

    if (window.google) {
      initMap();
    } else {
      window.initMap = initMap;
    }
  }, []);

  return (
    <div id="container">
      <h1>My Google Map</h1>
      <GoogleMapComponent />
      <div id="map" ref={mapRef}></div>
      <div id="sidebar">
        <h3>Request</h3>
        <pre ref={requestRef}></pre>
        <h3>Response</h3>
        <pre ref={responseRef}></pre>
      </div>
    </div>
  );
}

export default App;
