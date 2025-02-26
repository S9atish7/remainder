const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let reminders = []; // Store reminders

// Add a reminder
app.post('/add-reminder', (req, res) => {
    const { task, time } = req.body;
    if (!task || !time) {
        return res.status(400).json({ error: "Task and time are required!" });
    }
    reminders.push({ task, time });
    res.json({ message: "Reminder added successfully!" });
});

// Get all reminders
app.get('/reminders', (req, res) => {
    res.json(reminders);
});

// Start the backend server
const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
