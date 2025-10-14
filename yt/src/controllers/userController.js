const jwt = require('jsonwebtoken');
const config = require('../configs/config');
const User = require('../models/User');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields (name, email, password) are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password
        });

        // Save user to database
        const savedUser = await newUser.save();

        // Return success response (exclude password from response)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                createdAt: savedUser.createdAt
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        // Handle duplicate key error (email already exists)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Generic server error
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
};

module.exports = {
    registerUser,
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password are required' });
            }
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION || '7d' });
            return res.json({
                success: true,
                message: 'Login successful',
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
    getUserProfile: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId).select('-password');
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            return res.json({ success: true, data: user });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;
            // Only the user themself or admin can delete
            if (req.user.id !== userId && req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }
            const user = await User.findByIdAndDelete(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            return res.json({ success: true, message: 'User deleted' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
};

