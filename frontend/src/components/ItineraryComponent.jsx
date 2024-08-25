import React from 'react';
import './ItineraryComponent.css';

const ItineraryComponent = ({ selectedResults }) => {
    return (
        <div className="itinerary-container">
            <h3>Your Selected Itinerary</h3>
            <ul className="itinerary-list">
                {selectedResults.map((result, index) => (
                    <li key={index} className="itinerary-item">
                        <div className="itinerary-details">
                            <span className="itinerary-name">{result.place}</span>
                            <span className="itinerary-type">{result.description}</span>
                        </div>
                        <div className="itinerary-times">
                            <span className="itinerary-start-time">Start: {result.startTime}</span>
                            <span className="itinerary-end-time">End: {result.endTime}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItineraryComponent;
