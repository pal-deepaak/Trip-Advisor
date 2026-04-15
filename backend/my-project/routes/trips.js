const axios = require('axios');
const express = require('express');
const router = express.Router();
const Trip = require('../models/TripModel');
const Feedback = require('../models/feedback');

// 1. Trip Create karne ka Route
router.post('/create', async (req, res) => {
    try {
        const { user, destination, startDate, endDate, budget } = req.body;
        const newTrip = new Trip({ user, destination, startDate, endDate, budget });
        const trip = await newTrip.save();
        res.json(trip);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 2. Itinerary Update karne ka Route
router.put('/itinerary/:id', async (req, res) => {
    try {
        const { day, activities } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ msg: 'Trip not found' });
        }

        trip.itinerary.push({ day, activities });
        await trip.save();
        res.json(trip);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @route   GET api/trips/user/:userId
// @desc    Get all trips for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.params.userId }).sort({ createdAt: -1 });
        
        if (!trips || trips.length === 0) {
            return res.status(404).json({ msg: 'No trips found for this user' });
        }

        res.json(trips);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.post('/calculate-budget', (req, res) => {
    const { days, perDayCost, flightCost } = req.body;

    if (!days || !perDayCost) {
        return res.status(400).json({ msg: "Please enter days and per day cost" });
    }

    const totalBudget = (days * perDayCost) + (flightCost || 0);

    res.json({ 
        estimated_total: totalBudget,
        currency: "INR",
        breakup: {
            stay_and_food: days * perDayCost,
            travel: flightCost || 0
        }
    });
});
router.post('/feedback', async (req, res) => {
    try {
        let { user, tripId, rating, comment } = req.body;

        const newFeedback = new Feedback({
            user: user.trim(), 
            tripId: tripId.trim(),
            rating,
            comment
        });

        await newFeedback.save();
        res.json({ msg: "Feedback submitted successfully!" });
    } catch (err) {
        console.error("Final Error Check:", err.message);
        res.status(500).send('Server Error');
    }
});
// 1. Hotels save karne ke liye
router.put('/save-hotels/:id', async (req, res) => {
    try {
        const { hotelsList } = req.body;
        const trip = await Trip.findByIdAndUpdate(
            req.params.id.trim(),
            { $set: { hotels: hotelsList } },
            { new: true }
        );
        res.json(trip);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// 2. Restaurants save karne ke liye
router.put('/save-restaurants/:id', async (req, res) => {
    try {
        const { restaurantsList } = req.body;
        const trip = await Trip.findByIdAndUpdate(
            req.params.id.trim(),
            { $set: { restaurants: restaurantsList } },
            { new: true }
        );
        res.json(trip);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});
// 3. Hotels save karne ke liye
router.put('/save-hotels/:id', async (req, res) => {
    try {
        const { hotelsList } = req.body;
        const trip = await Trip.findByIdAndUpdate(
            req.params.id.trim(),
            { $set: { hotels: hotelsList } },
            { new: true }
        );
        res.json(trip);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// 4. Suggestions save karne ke liye
router.put('/save-suggestions/:id', async (req, res) => {
    try {
        const { suggestionsList } = req.body; // Postman ki body se match karega
        const trip = await Trip.findByIdAndUpdate(
            req.params.id.trim(),
            { $set: { suggestions: suggestionsList } }, // Model mein 'suggestions' field check kar lena
            { new: true }
        );
        
        if (!trip) return res.status(404).json({ msg: 'Trip not found' });
        
        res.json(trip);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Live Weather Fetch Route
router.get('/weather/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const apiKey = "940e64c0a797925ce21d6e54e8a1bd4e"; // OpenWeatherMap se milegi
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        const response = await axios.get(url);
        res.json({
            temp: response.data.main.temp,
            desc: response.data.weather[0].description,
            icon: response.data.weather[0].icon
        });
    } catch (err) {
        res.status(500).json({ msg: "Weather fetch fail ho gaya" });
    }
});

// 7. Get saved trips for a user
router.get('/saved-trips/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // In a real app, this would fetch from database
        res.json({
            userId: userId,
            savedTrips: [
                {
                    id: "trip1",
                    destination: "Chandigarh",
                    startDate: "2026-05-01",
                    endDate: "2026-05-05",
                    budget: 15000,
                    saved: true
                },
                {
                    id: "trip2",
                    destination: "Manali",
                    startDate: "2026-06-15",
                    endDate: "2026-06-20",
                    budget: 25000,
                    saved: true
                }
            ]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 8. Get travel routes for a city
router.get('/routes/:city', async (req, res) => {
    try {
        const city = req.params.city.toLowerCase();

        // Route visualization data
        const routesData = {
            chandigarh: {
                routes: [
                    { from: "Chandigarh", to: "Manali", distance: "300 km", duration: "6 hours" },
                    { from: "Chandigarh", to: "Shimla", distance: "120 km", duration: "3 hours" }
                ]
            },
            manali: {
                routes: [
                    { from: "Manali", to: "Chandigarh", distance: "300 km", duration: "6 hours" },
                    { from: "Manali", to: "Leh", distance: "400 km", duration: "8 hours" }
                ]
            },
            shimla: {
                routes: [
                    { from: "Shimla", to: "Chandigarh", distance: "120 km", duration: "3 hours" },
                    { from: "Shimla", to: "Manali", distance: "400 km", duration: "8 hours" }
                ]
            }
        };

        res.json({
            city: city.charAt(0).toUpperCase() + city.slice(1),
            routes: routesData[city]?.routes || []
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// Budget Calculate aur Database mein Save karne ka route
router.put('/save-budget/:id', async (req, res) => {
    try {
        const { days, perDayCost, flightCost } = req.body;
        
        // Calculation logic
        const total = (Number(days) * Number(perDayCost)) + (Number(flightCost) || 0);

        const trip = await Trip.findByIdAndUpdate(
            req.params.id.trim(),
            { $set: { budget: total } }, 
            { new: true }
        );

        if (!trip) return res.status(404).json({ msg: "Trip nahi mila!" });

        res.json({ 
            msg: "Budget Calculate aur Save ho gaya!", 
            totalBudget: total, 
            trip 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Budget save error');
    }
});
module.exports = router;