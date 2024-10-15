import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    if (req.method === 'POST') {
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
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}