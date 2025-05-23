const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(__dirname));

// Handle GET requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log('Press Ctrl+C to stop the server');
});
