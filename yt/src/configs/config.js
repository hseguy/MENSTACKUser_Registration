const dotenv = require('dotenv');
dotenv.config();
const config ={
    PORT : process.env.PORT || 5000,
    MONGODB_URL : process.env.MONGODB_URL || "mongodb://localhost:27017/test",
    JWT_SECRET : process.env.JWT_SECRET,
    JWT_EXPIRATION : process.env.JWT_EXPIRATION ,
    CORS_ORIGIN : process.env.CORS_ORIGIN || "http://localhost:3000",
    API_BASE_URL : process.env.API_BASE_URL || "/http://localhost:5000/api",
    FRONTEND_BASE_URL : process.env.FRONTEND_BASE_URL || "http://localhost:3000"
};

module.exports = config;