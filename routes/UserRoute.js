const express = require('express');
const router = express.Router();
const User = require('../models/UserSchema');
const jwt = require('jsonwebtoken');
const DecodeToken = require('../middlewares/DecodeToken'); // Middleware to authenticate user

router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword, phoneNo, age } = req.body;

    try {
        // Validation
        if (!username || !email || !password || !confirmPassword || !phoneNo || !age) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create a new user without hashing the password
        const newUser = new User({
            username,
            email,
            password, // Store password as plain text
            phoneNo,
            age,
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Create and send a JWT token for authentication
        const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Set the token in a cookie
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        // Send the user data (excluding password) and token
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                phoneNo: savedUser.phoneNo,
                age: savedUser.age,
            },
            token,
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Server error. Try again later.' });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check password (store it as plain text, so we just compare it directly)
        if (user.password !== password) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Create a new JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Set the token in a cookie
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        // Send user data (excluding password) and token
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phoneNo: user.phoneNo,
                age: user.age,
            },
            token,
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Server error. Try again later.' });
    }
});

// Follow a user
router.post('/follow/:id', DecodeToken, async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.userId);

        if (!userToFollow) {
            return res.status(404).json({ error: 'User to follow not found' });
        }

        // Prevent users from following themselves
        if (userToFollow._id.equals(currentUser._id)) {
            return res.status(400).json({ error: 'You cannot follow yourself' });
        }

        // Check if already following
        if (currentUser.following.includes(userToFollow._id)) {
            return res.status(400).json({ error: 'You are already following this user' });
        }

        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);

        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({ message: `You are now following ${userToFollow.username}` });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Server error. Try again later.' });
    }
});

// Unfollow a user
router.post('/unfollow/:id', DecodeToken, async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.userId);

        if (!userToUnfollow) {
            return res.status(404).json({ error: 'User to unfollow not found' });
        }

        // Check if not following
        if (!currentUser.following.includes(userToUnfollow._id)) {
            return res.status(400).json({ error: 'You are not following this user' });
        }

        currentUser.following.pull(userToUnfollow._id);
        userToUnfollow.followers.pull(currentUser._id);

        await currentUser.save();
        await userToUnfollow.save();

        res.status(200).json({ message: `You have unfollowed ${userToUnfollow.username}` });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Server error. Try again later.' });
    }
});

module.exports = router;
