const express = require('express');

const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 5000;
dotenv.config();

// Use the CORS middleware with your options
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Use express.urlencoded() for parsing URL-encoded request bodies


app.get('/api/weather', async (req, res) => {
    try {
        const { location } = req.query;

        const apiKey = process.env.WEATHER_API_KEY;
        console.log(JSON.stringify(apiKey, null, 2));
        // const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`
        const response = await axios.get(apiUrl);

        const weatherData = response.data;
        weatherData.current.temp_c = weatherData.current.temp_c.toFixed(0);
        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.get('/api/location', async (req, res) => {
    try {
        const { lat, lon } = req.query;

        const apiKey = process.env.WEATHER_API_KEY;
        // const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const apiUrl = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${lat},${lon}&aqi=no`
        const response = await axios.get(apiUrl);
        const locationData = response.data[0];
        res.json(locationData.name);
    } catch (error) {
        console.log(error);
    }
});

app.get('/api/future-weather', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const apiKey = process.env.WEATHER_API_KEY;
        const tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 16);
        const tomorrowDateString = tomorrowDate.toISOString().split('T')[0];
        console.log(tomorrowDateString);
        const apiUrl = `https://api.weatherapi.com/v1/future.json?key=${apiKey}&q=${lat},${lon}&dt=${tomorrowDateString}`;
        console.log(apiUrl);
        // https://api.weatherapi.com/v1/future.json?key=b7b7fd83f3d94c03b7c42745241104&q=${weatherData.location.lat},${weatherData.location.lon}&dt=${tomorrowDate}`)
        const response = await axios.get(apiUrl);

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch future weather data' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})




