import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userHandler from './api/user.js'; // Import your API handler

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// API Routes
app.use('/api/user', userHandler); // Link the user handler to /api/user route

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});