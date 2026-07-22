const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, email } = req.body;

    console.log("Name:", name);
    console.log("Email:", email);

    res.send(`
        <h2>Form Submitted Successfully!</h2>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <a href="/">Go Back</a>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});