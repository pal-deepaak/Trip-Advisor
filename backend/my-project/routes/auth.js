const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// @route   POST api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // 2. Create new user instance
        user = new User({ name, email, password });

        // 3. Hash password for security
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Save to Database
        await user.save();
        res.json({ msg: 'User registered successfully!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
// @route   POST api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. User ko dhoondo
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // 2. Password match karo
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        res.json({ 
            msg: 'Login Successful!', 
            name: user.name,
            userId: user._id 
        });

    } catch (err) {
        res.status(500).send('Server error');
    }
});
module.exports = router;