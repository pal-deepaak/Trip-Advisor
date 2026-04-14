const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware (Data process karne ke liye)
app.use(express.json());
app.use(cors());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/travel', require('./routes/travel'));
app.use('/api/trips', require('./routes/trips'));

// Database Connection
// Yahan hum .env se variables utha rahe hain
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => console.log("❌ Database Connection Error:", err));

// Basic Route (Checking ke liye)
app.get('/', (req, res) => {
    res.send("Ankush's Tourist Advisor API is Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});
