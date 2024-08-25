import React from 'react';
import './FriendsBarComponent.css'; // Import the CSS file

const FriendsBarComponent = ({ friends, onSelectFriend }) => {
  return (
    <div id="friends-bar">
      <h2>Friends List</h2>
      <ul>
        {friends.map((friend, index) => (
          <li
            key={index}
            onClick={() => onSelectFriend(friend)}
          >
            <strong className="friend-name">{friend.name}</strong> -
            <span className="friend-location">{friend.location}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsBarComponent;
