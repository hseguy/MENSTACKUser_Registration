const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Add comment to a post
exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        if (!content) return res.status(400).json({ success: false, message: 'Content is required' });
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
        const comment = await Comment.create({ post: postId, user: req.user.id, content });
        res.status(201).json({ success: true, data: comment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// List comments for a post
exports.getCommentsForPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId).select('_id');
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
        const comments = await Comment.find({ post: postId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        return res.json({ success: true, data: comments });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update comment (owner only)
exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        const { content } = req.body;
        if (content !== undefined) comment.content = content;
        await comment.save();
        res.json({ success: true, data: comment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete comment (owner or post author)
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
        const post = await Post.findById(comment.post);
        const isOwner = comment.user.toString() === req.user.id;
        const isPostAuthor = post && post.author.toString() === req.user.id;
        if (!isOwner && !isPostAuthor) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        await comment.deleteOne();
        res.json({ success: true, message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


