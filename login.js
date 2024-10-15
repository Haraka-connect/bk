import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt'; // Install bcrypt in your package.json

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();

        const user = await db.collection('users').findOne({ email });
        client.close();

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // You can generate a JWT token here for session management
        res.status(200).json({ message: 'Login successful', user });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}