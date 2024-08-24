const express = require('express')


const app = express()

app.use(express.json())

const router = require('./routes/places.js'); // Import the router

app.use('/api', router); // Use the router with a base path


app.get('/', (request, response) => {
    response.send("Hello world")
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})