const Post = require('../models/Post');

// Create post
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required' });
        }
        const post = await Post.create({ title, content, author: req.user.id });
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get all posts
exports.getAllPosts = async (_req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name email');
        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name email');
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update post (only owner)
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        const { title, content } = req.body;
        if (title !== undefined) post.title = title;
        if (content !== undefined) post.content = content;
        await post.save();
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete post (only owner)
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        await post.deleteOne();
        res.json({ success: true, message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


