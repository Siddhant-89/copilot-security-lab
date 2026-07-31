const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Use an environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_a_secure_secret';
const PORT = process.env.PORT || 3000;

// In-memory user store for demo purposes only.
// In real apps, use a database.
const users = {};

/**
 * Register a user (hashes password).
 * In production, this would be in a separate "register" flow.
 */
async function createUser(username, password) {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  users[username] = { passwordHash };
  return { username };
}

/**
 * login(username, password)
 * - returns a JWT string on success
 * - returns null on failure
 */
async function login(username, password) {
  const user = users[username];
  if (!user) return null;

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return null;

  // Create a token with minimal payload. Add claims as needed.
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  return token;
}

// Demo endpoints
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  if (users[username]) return res.status(409).json({ error: 'user already exists' });

  await createUser(username, password);
  res.status(201).json({ message: 'user created' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const token = await login(username, password);
  if (!token) return res.status(401).json({ error: 'invalid credentials' });

  res.json({ token });
});

app.get('/protected', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing token' });

  const token = auth.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ message: 'you accessed a protected route', user: payload });
  } catch (err) {
    res.status(401).json({ error: 'invalid token' });
  }
});

(async () => {
  // Create a demo user so you can test immediately:
  await createUser('alice', 'password123');

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Demo user created: username=alice password=password123');
  });
})();