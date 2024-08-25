import React, { useState } from 'react';
import axios from 'axios';
import './ResultsDisplay.css';

const ResultsDisplay = ({ results, onSelect }) => {
    const [checkedPlaces, setCheckedPlaces] = useState([]);

    const handleCheckboxChange = (place) => {
        setCheckedPlaces((prevCheckedPlaces) => {
            const isChecked = prevCheckedPlaces.includes(place);
            if (isChecked) {
                // If already checked, remove from list
                return prevCheckedPlaces.filter(p => p !== place);
            } else {
                // Otherwise, add to list
                return [...prevCheckedPlaces, place];
            }
        });
    };

    const handleSubmitSelection = async () => {
        // Prepare data to send in the POST request
        const dataToSend = checkedPlaces.map(place => ({
            displayName: place.displayName,
            location: place.location,
            businessStatus: place.businessStatus,
            type: place.type.charAt(0).toUpperCase() + place.type.slice(1),
        }));

        try {
            const response = await axios.post('http://localhost:3001/api/gemini', dataToSend);
            console.log('Response:', response.data.itinerary);

            // Update checkedPlaces with the response data
            // setCheckedPlaces(response.data.itinerary);

            // Call onSelect with the response data
            if (onSelect) {
                onSelect(checkedPlaces, response.data.itinerary);
            }
        } catch (error) {
            console.error('Error sending data:', error);
        }

        // console.log(checkedPlaces);
    };

    return (
        <div className="results-display">
            <h3>Select Itinerary Locations</h3>
            {results.length === 0 ? (
                <p>No results found.</p>
            ) : (
                <ul>
                    {results.map((place, index) => (
                        <li key={index} className="result-item">
                            <span>{place.displayName}</span>
                            <span>{place.type.charAt(0).toUpperCase() + place.type.slice(1)}</span>
                            <input
                                type="checkbox"
                                checked={checkedPlaces.includes(place)}
                                onChange={() => handleCheckboxChange(place)}
                            />
                        </li>
                    ))}
                </ul>
            )}
            <button className="select-button" onClick={handleSubmitSelection}>
                Create Itinerary
            </button>
        </div>
    );
};

export default ResultsDisplay;
