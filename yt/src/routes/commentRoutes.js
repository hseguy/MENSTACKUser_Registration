const express = require('express');
const { authenticate } = require('../middleware/auth');
const { addComment, updateComment, deleteComment, getCommentsForPost } = require('../controllers/commentController');

const router = express.Router();

router.post('/:postId', authenticate, addComment);
router.get('/:postId', getCommentsForPost);
router.put('/:id', authenticate, updateComment);
router.delete('/:id', authenticate, deleteComment);

module.exports = router;


