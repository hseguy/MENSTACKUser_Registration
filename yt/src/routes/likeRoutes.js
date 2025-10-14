const express = require('express');
const { authenticate } = require('../middleware/auth');
const { likePost, unlikePost, countLikes } = require('../controllers/likeController');

const router = express.Router();

router.post('/posts/:id/like', authenticate, likePost);
router.delete('/posts/:id/unlike', authenticate, unlikePost);
router.get('/posts/:id/likes', countLikes);

module.exports = router;


