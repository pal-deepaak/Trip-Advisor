// models/feedback.js
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'trip', required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

// Yahan 'Feedback' (Capital F) rakho model name
module.exports = mongoose.model('Feedback', FeedbackSchema);