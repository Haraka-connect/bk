import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// API Route to handle user signup
app.post('/api/signup', async (req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;

    // Basic validation
    if (!firstname || !lastname || !email || !password || !phone) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    let client;

    try {
        // Connect to MongoDB
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }
        client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();

        // Store user data in the database
        const result = await db.collection('users').insertOne({
            firstname,
            lastname,
            email,
            phone,
            password: hashedPassword // Store hashed password
        });

        res.status(201).json({ message: 'User created', userId: result.insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the user.' });
    } finally {
        // Close the client connection
        if (client) {
            await client.close();
        }
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});