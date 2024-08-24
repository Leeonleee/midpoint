import React, { useState } from 'react';
import './ResultsDisplay.css'; // Ensure you have a CSS file for styling

const ResultsDisplay = ({ results, onSelect }) => {
    const [selectedPlace, setSelectedPlace] = useState(null);

    const handleSelect = (place) => {
        setSelectedPlace(place);
        if (onSelect) {
            onSelect(place);
        }
    };

    return (
        <div className="results-display">
            <h3>Select a Place</h3>
            {results.length === 0 ? (
                <p>No results found.</p>
            ) : (
                <ul>
                    {results.map((place, index) => (
                        <li
                            key={index}
                            className={`result-item ${selectedPlace === place ? 'selected' : ''}`}
                            onClick={() => handleSelect(place)}
                        >
                            {place.displayName}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ResultsDisplay;
