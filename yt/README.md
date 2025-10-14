# Blog Website User Registration API

A user registration API for a blog website built with the MEN stack (MongoDB, Express.js, Node.js).

## Features

- User registration with name, email, and password
- Input validation and error handling
- MongoDB database integration
- RESTful API endpoints

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URL=mongodb://localhost:27017/blog_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:3000
API_BASE_URL=http://localhost:5000/api
FRONTEND_BASE_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:
- Local MongoDB: `mongod`
- MongoDB Atlas: Update the MONGODB_URL in your .env file

### 4. Start the Server

```bash
npm run dev
```

The server will start on port 5000 (or the port specified in your .env file).

## API Endpoints

### POST /api/users/register

Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400/409/500):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Testing with Postman

1. Open Postman
2. Create a new POST request
3. Set URL to: `http://localhost:5000/api/users/register`
4. Set Headers: `Content-Type: application/json`
5. Set Body (raw JSON):
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "testpassword"
   }
   ```
6. Send the request

## Project Structure

```
src/
├── configs/
│   ├── config.js    # Configuration settings
│   └── db.js        # Database connection
├── controllers/
│   └── userController.js  # User registration logic
├── models/
│   └── User.js      # User schema/model
└── routes/
    └── userRoutes.js # User routes
```

## Validation Rules

- **Name**: Required, 2-50 characters
- **Email**: Required, valid email format, unique
- **Password**: Required, minimum 6 characters

