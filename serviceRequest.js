import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userId, serviceType, details } = req.body;

        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();

        const result = await db.collection('serviceRequests').insertOne({
            userId,
            serviceType,
            details,
            createdAt: new Date()
        });

        client.close();
        res.status(201).json({ message: 'Service request created', requestId: result.insertedId });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}