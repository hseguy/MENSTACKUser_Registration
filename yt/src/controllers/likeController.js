const Like = require('../models/Like');
const Post = require('../models/Post');

exports.likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        // Create like document; unique index prevents duplicates
        await Like.create({ user: req.user.id, post: postId });
        return res.status(201).json({ success: true, message: 'Post liked' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(200).json({ success: true, message: 'Already liked' });
        }
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.unlikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const result = await Like.findOneAndDelete({ user: req.user.id, post: postId });
        if (!result) return res.status(404).json({ success: false, message: 'Like not found' });
        return res.json({ success: true, message: 'Post unliked' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.countLikes = async (req, res) => {
    try {
        const postId = req.params.id;
        const [{ count } = { count: 0 }] = await Like.aggregate([
            { $match: { post: require('mongoose').Types.ObjectId.createFromHexString(postId) } },
            { $count: 'count' }
        ]);
        return res.json({ success: true, postId, likes: count });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


