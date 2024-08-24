import React, { useState } from 'react';
import './ResultsDisplay.css'; // Ensure you have a CSS file for styling

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
                console.log(place.businessStatus);
                return [...prevCheckedPlaces, place];
            }
        });
    };

    const handleSubmitSelection = () => {
        if (onSelect) {
            onSelect(checkedPlaces);
        }
        console.log(checkedPlaces)
    };

    return (
        <div className="results-display">
            <h3>Select Places</h3>
            {results.length === 0 ? (
                <p>No results found.</p>
            ) : (
                <ul>
                    {results.map((place, index) => (
                        <li key={index} className="result-item">
                            <span>{place.displayName}</span>
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
                Submit Selection
            </button>
        </div>
    );
};

export default ResultsDisplay;
