const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   GET api/travel/weather/:city
router.get('/weather/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const apiKey = process.env.WEATHER_API_KEY; 
        
        // OpenWeather se data fetch karna
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        
        const response = await axios.get(url);
        const data = response.data;
        const temp = data.main.temp;

        // Tourist Spots ka data
        const spots = {
            "chandigarh": ["Rock Garden", "Sukhna Lake", "Rose Garden", "Sector 17 Market"],
            "panchkula": ["Morni Hills", "Pinjore Gardens", "Nada Sahib Gurudwara", "Mansa Devi Temple"],
            "shimla": ["The Ridge", "Mall Road", "Jakhu Temple", "Kufri"]
        };

        // AI Advice Logic
        let advice = "";
        if (temp > 30) {
            advice = "Garmi kaafi hai! Cotton clothes pehno aur hydration ka dhyan rakho.";
        } else if (temp < 15) {
            advice = "Mausam thanda hai. Jacket saath rakho, khas kar shaam ko.";
        } else {
            advice = "Mausam ekdum badiya hai! Ghoomne ke liye perfect time hai.";
        }

        // Response bhej rahe hain
        res.json({
            city: data.name,
            temp: `${temp}°C`,
            condition: data.weather[0].description,
            suggested_spots: spots[city.toLowerCase()] || ["Local Market", "Famous Parks", "City Center"],
            ai_advice: advice
        });

    } catch (err) {
        // Agar key active nahi hai toh error yahan console mein dikhega
        console.log("Status Code:", err.response ? err.response.status : "Error");
        res.status(500).json({ msg: "API Key activation in progress. Please wait 30-60 mins." });
    }
});
// @route   GET api/travel/recommendations/:city
// @desc    Get top hotels and restaurants for a city
router.get('/recommendations/:city', async (req, res) => {
    const city = req.params.city.toLowerCase();

    // Dummy data for Demo (Inhe baad mein database se connect kar sakte hain)
    const data = {
        chandigarh: {
            hotels: ["JW Marriott", "The Lalit", "Hotel Mountview"],
            restaurants: ["Pal Dhaba", "Sethi Dhaba", "Virgin Courtyard"],
            places: ["Rock Garden", "Sukhna Lake", "Rose Garden"]
        },
        manali: {
            hotels: ["Span Resort", "Manuallaya", "The Johnson Lodge"],
            restaurants: ["Cafe 1947", "Johnson's Cafe", "Chopsticks"],
            places: ["Hadimba Temple", "Solang Valley", "Old Manali"]
        }
    };

    if (data[city]) {
        res.json(data[city]);
    } else {
        res.status(404).json({ msg: "Recommendations not found for this city yet." });
    }
});

module.exports = router;