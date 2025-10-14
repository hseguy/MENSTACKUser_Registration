const jwt = require('jsonwebtoken');
const config = require('../configs/config');
const User = require('../models/User');

// Verify JWT and attach user to request
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication token missing' });
        }

        const payload = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(payload.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid token user' });
        }
        req.user = user; // attach sanitized user
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

// Require specific roles
const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
};

module.exports = { authenticate, authorize };


