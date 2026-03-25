const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const LoginUser = require('./models/LoginUser');

dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

async function verifyLoginFlow() {
  try {
    const testEmail = `login_test_${Date.now()}@example.com`;
    const testPassword = 'securepassword123';

    // 1. Register User
    console.log('1. Registering user to test bcrypt hashing...');
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Login',
        lastName: 'Tester',
        email: testEmail,
        password: testPassword
      })
    });
    const regData = await regRes.json();
    console.log('Register status:', regRes.status);
    
    if (regRes.status !== 201) return console.error('Failed to register', regData);

    // 2. Login User
    console.log('\n2. Logging in via credentials to get JWT...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: testEmail,
        password: testPassword
      })
    });
    const loginData = await loginRes.json();
    console.log('Login status:', loginRes.status);

    if (loginRes.status === 200 && loginData.token) {
      console.log('SUCCESS: JWT Token received =>', loginData.token.substring(0, 20) + '...');
      
      console.log('\n3. Connecting to MongoDB to verify loginusers tracking collection...');
      await mongoose.connect(process.env.MONGO_URI);
      
      const dbLogin = await LoginUser.findOne({ email: testEmail });
      if (dbLogin) {
        console.log('SUCCESS: Active session tracked in `loginusers` collection!');
        console.log('DB Record mapped to userId:', dbLogin.userId);
        
        console.log('\n4. Cleaning up test data from `users` and `loginusers`...');
        await User.deleteOne({ email: testEmail });
        await LoginUser.deleteOne({ email: testEmail });
        console.log('Cleanup complete.');
      } else {
        console.log('FAILURE: User logged in, but not found in `loginusers` collection.');
      }
      await mongoose.disconnect();
    } else {
      console.log('Login failed:', loginData);
    }
  } catch (err) {
    console.error('Verification failed:', err);
  }
}

verifyLoginFlow();
