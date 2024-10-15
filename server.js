const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000; // Use Vercel's PORT

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Sample Data
let users = []; // This will temporarily store users (for demonstration)

// Route to handle user signup
app.post('/api/signup', async (req, res) => {
    const { firstname, lastname, email, phone, password, service } = req.body;

    // Basic validation (you can expand this)
    if (!firstname || !lastname || !email || !password || !service) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { firstname, lastname, email, phone, password: hashedPassword, service };
    users.push(newUser); // Add to the in-memory array

    return res.status(201).json({ message: 'User registered successfully.', user: newUser });
});

// Route to handle user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (user && await bcrypt.compare(password, user.password)) {
        return res.status(200).json({ message: 'Login successful!', user });
    } else {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});