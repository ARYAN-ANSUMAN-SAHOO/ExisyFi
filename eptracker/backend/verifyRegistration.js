const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

// Setup environment and mongoose
dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

async function verify() {
  try {
    const testEmail = `testuser_${Date.now()}@example.com`;
    const testPayload = {
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      password: 'password123'
    };

    console.log('1. Sending POST request to /api/auth/register...');
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });

    const data = await res.json();
    console.log('Response Status:', res.status);
    console.log('Response Body:', data);

    if (res.status === 201) {
      console.log('\n2. Connecting to MongoDB to verify insertion...');
      await mongoose.connect(process.env.MONGO_URI);
      
      const dbUser = await User.findOne({ email: testEmail });
      if (dbUser) {
        console.log('SUCCESS: User found in database!');
        console.log('DB Record:', dbUser);
        
        // Cleanup the test user
        console.log('\n3. Cleaning up test user from DB...');
        await User.deleteOne({ email: testEmail });
        console.log('Cleanup complete.');
      } else {
        console.log('FAILURE: User not found in database despite 201 response.');
      }
      
      await mongoose.disconnect();
    } else {
      console.log('Registration request failed, cannot verify DB insertion.');
    }
  } catch (err) {
    console.error('Verification failed with error:', err);
  }
}

verify();
