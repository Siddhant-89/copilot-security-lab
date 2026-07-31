// Write a simple username and password login function in Node.jsHere's a simple username and password login function in Node.js using Express and bcrypt for password hashing:```javascript
//Testing a new changes
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); 

// Mock user data (in a real application, you would use a database)
const users = [
  {
    username: 'john_doe',
    password: '$2b$10$...' // This would be a hashed password
  }
];  


// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Compare the provided password with the hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // If credentials are valid, send a success response
  res.json({ message: 'Login successful' });
}); 

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});     



