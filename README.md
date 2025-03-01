# Demo
<a href="https://www.youtube.com/watch?v=2B5hdKuY39A" target="_blank" rel="noopener noreferrer">
  <img src="https://github.com/Leeonleee/midpoint/blob/main/images/Screenshot%202025-02-06%20at%208.35.18%E2%80%AFPM.png" alt="Video Demo">
</a>

# Installation

## Program Setup
### Introduction
- Please make sure you are on/download the `main` branch, as that contains the latest program code

### API Keys
- In the `backend` and `frontend` folder, you will need to create an `.env` file, which will contain the relevant API keys. The file must follow this format:

```
GOOGLE_API_KEY=YOUR_MAPS_API_KEY_HERE
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
VITE_GOOGLE_API_KEY=YOUR_MAPS_API_KEY_HERE
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
VITE_API_BASE_URL=http://localhost:3001/api
```

### Installing Node.js
- Please follow the instructions in this link to install Node.js (npm will also be installed)
    - https://nodejs.org/en/download/package-manager/


## Running the Program
- Once you have the `.env` files set and Node.js installed, you can start the program
- Ensure you are in the root directory of the project (`midpoint`)
- Run the command `npm run install-all`
    - This will install all dependencies and start the frontend/backend
- Run the command `npm run start`
- To access the program, go to `http://localhost:5173/`


# Inspiration
Plagued by both indecision as well as the annoyance to travel far to meet up with friends, midpoint was born. Here, we wanted to create a website that found the midpoint between two friends, generating a list of activities/restaurants for a quick catchup.

# What it does
midpoint is a web app that allows for the instantaneous calculation of the middle ground between two individuals, while also generating a list of activities/restaurants, and depending on the user's preference, feeds into a personalised itinerary for the two friends. This allows them to connect quickly and efficiently, while also having ideas of what to do.

# How we built it
We have built this app over React.js for the frontend and Node and Express in the backend. We additionally utilise multiple API calls to both Google Map API as well as Gemini.

# Challenges we ran into
The main issue was understanding how to implementing our own API keys across a shared github while allowing all the API calls to function correctly and efficiently. Additionally, another big issue was the communication between the Frontend and Backend, utilising Axios and Post requests.

# Accomplishments that we're proud of
The use of Google Maps API as well as Gemini's API. Additionally, the connection between the frontend and backend as well as the beautiful, intuitive and responsive UI.

# What we learned
We learnt a high degree in how to create an effective and user friendly frontend, as well as the implementation of multiple API's and managing access of the API keys across multiple devices.

# What's next for Project
We desire to add extra features to this project given that we have created an initial MVP. Some examples of further features that we could add include: Providing travel methods for each person to go to the relevant restaurant/activity, accounting for travel times between each activity, options for different types of hangouts (e.g. friend, date) and also a choice for how much money the person is willing to spend. These changes will allow the program to excel further in catering towards different users needs and therefore become more user friendly.
