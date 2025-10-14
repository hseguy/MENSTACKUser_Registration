const express = require('express');
const { registerUser, loginUser, getUserProfile, deleteUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/users/register - Register a new user
router.post('/register', registerUser);

// POST /api/users/login - Login
router.post('/login', loginUser);

// GET /api/users/:id - Profile
router.get('/:id', authenticate, getUserProfile);

// DELETE /api/users/:id - Delete
router.delete('/:id', authenticate, deleteUser);

module.exports = router;

