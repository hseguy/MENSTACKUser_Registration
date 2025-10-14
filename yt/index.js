const express = require('express');
const config = require('./src/configs/config');
const db = require('./src/configs/db');
const userRoutes = require('./src/routes/userRoutes');
const postRoutes = require('./src/routes/postRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const likeRoutes = require('./src/routes/likeRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api', likeRoutes);

// 404 handler
app.use((req, res) => {
    return res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    return res.status(status).json({ success: false, message });
});

// Health check route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Blog API Server is running!',
        endpoints: {
            register: 'POST /api/users/register'
        }
    });
});

const port = config.PORT;
console.log(`Configured port: ${port}`);

// Connect to database and start server
const startServer = async () => {
    try {
        await db.connect();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`API Base URL: http://localhost:${port}/api`);
            console.log('Users: POST /api/users/register | POST /api/users/login');
            console.log('Posts: POST/GET /api/posts | GET/PUT/DELETE /api/posts/:id');
            console.log('Comments: POST /api/comments/:postId | PUT/DELETE /api/comments/:id');
            console.log('Likes: POST /api/posts/:id/like | DELETE /api/posts/:id/unlike | GET /api/posts/:id/likes');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();