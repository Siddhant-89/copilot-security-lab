const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, expectedHash] = storedHash.split(':');
  const derivedHash = crypto.scryptSync(password, salt, 64).toString('hex');
  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  const derivedBuffer = Buffer.from(derivedHash, 'hex');

  if (expectedBuffer.length !== derivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, derivedBuffer);
}

const user = {
  username: 'admin',
  passwordHash: hashPassword('Password123!')
};

function login(username, password) {
  if (typeof username !== 'string' || typeof password !== 'string') {
    return 'Invalid username or password';
  }

  const trimmedUsername = username.trim();
  if (trimmedUsername.length < 3 || password.length < 8) {
    return 'Invalid username or password';
  }

  if (trimmedUsername !== user.username) {
    return 'Invalid username or password';
  }

  return verifyPassword(password, user.passwordHash)
    ? 'Login successful'
    : 'Invalid username or password';
}

console.log(login('admin', 'Password123!'));
console.log(login('admin', 'wrongpassword'));
