import React, { useEffect, useRef } from "react";

const GoogleMapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    async function initMap() {
      const { Map, InfoWindow } = await google.maps.importLibrary("maps");
      const center = new google.maps.LatLng(52.369358, 4.889258);

      const map = new Map(mapRef.current, {
        center: center,
        zoom: 11,
        mapId: "DEMO_MAP_ID",
      });

      await nearbySearch(map);
    }

    async function nearbySearch(map) {
      const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      const center = new google.maps.LatLng(52.369358, 4.889258);
      const request = {
        fields: ["displayName", "location", "businessStatus"],
        locationRestriction: {
          center: center,
          radius: 500,
        },
        includedPrimaryTypes: ["restaurant"],
        maxResultCount: 5,
        rankPreference: SearchNearbyRankPreference.POPULARITY,
        language: "en-US",
        region: "us",
      };

      const { places } = await Place.searchNearby(request);

      if (places.length) {
        console.log(places);

        const { LatLngBounds } = await google.maps.importLibrary("core");
        const bounds = new LatLngBounds();

        places.forEach((place) => {
          new AdvancedMarkerElement({
            map,
            position: place.location,
            title: place.displayName,
          });

          bounds.extend(place.location);
          console.log(place);
        });

        map.fitBounds(bounds);
      } else {
        console.log("No results");
      }
    }

    initMap();
  }, []);

  return <div id="map" ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
};

export default GoogleMapComponent;
