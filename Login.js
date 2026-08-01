function login(username, password) {
  const validUsername = 'admin';
  const validPassword = 'password123';

  if (username === validUsername && password === validPassword) {
    return 'Login successful';
  }

  return 'Invalid username or password';
}

console.log(login('admin', 'password123'));
console.log(login('admin', 'wrongpassword'));
