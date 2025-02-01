// server.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

console.log('Starting server...');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/question-tracker')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

// Define the user schema
const userSchema = new mongoose.Schema({
    username: String,
    data: [{ date: String, count: Number }],
    notes: Map
});

// Define the user model
const User = mongoose.model('User', userSchema);

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to store user data
app.post('/store-data', async (req, res) => {
    const { username, date, count } = req.body;
    let user = await User.findOne({ username });
    if (!user) {
        user = new User({ username, data: [], notes: {} });
    }
    const existingEntry = user.data.find(entry => entry.date === date);
    if (existingEntry) {
        existingEntry.count = count;
    } else {
        user.data.push({ date, count });
    }
    await user.save();
    res.send('Data stored successfully');
});

// API endpoint to retrieve user data
app.post('/get-data', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ username });
    res.send(user ? user.data : []);
});

// API endpoint to store notes
app.post('/store-notes', async (req, res) => {
    const { username, date, notes } = req.body;
    let user = await User.findOne({ username });
    if (!user) {
        user = new User({ username, data: [], notes: {} });
    }
    user.notes.set(date, notes);
    await user.save();
    res.send('Notes stored successfully');
});

// API endpoint to retrieve notes
app.post('/get-notes', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ username });
    res.send(user ? Object.fromEntries(user.notes) : {});
});

// API endpoint to delete user data
app.post('/delete-data', async (req, res) => {
    const { username } = req.body;
    await User.findOneAndRemove({ username });
    res.send('Data deleted successfully');
});

// Start the server
const port = 3002;
app.listen(port, () => console.log(`Server started on port ${port}`));