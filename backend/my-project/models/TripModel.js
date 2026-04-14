const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Ye tumhare Signup wale model se link karega
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    itinerary: [
        {
            day: Number,
            activities: [String]
        }
    ],
    suggestions: [String],
    hotels: { type: Array, default: [] },
  restaurants: { type: Array, default: [] },
  budget: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('trip', TripSchema);