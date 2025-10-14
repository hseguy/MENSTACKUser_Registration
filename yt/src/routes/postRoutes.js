const express = require('express');
const { authenticate } = require('../middleware/auth');
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');

const router = express.Router();

router.post('/', authenticate, createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

module.exports = router;


