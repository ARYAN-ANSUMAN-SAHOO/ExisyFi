const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const jwt = require('jsonwebtoken');

dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_exisyfi';

async function verifyDashboardData() {
  try {
    const testEmail = `dashboard_test_${Date.now()}@example.com`;

    console.log('1. Connecting directly to MongoDB to execute Test Environment Setup...');
    await mongoose.connect(process.env.MONGO_URI);
    
    // Create Mock User
    const mockUser = new User({
        firstName: 'Dash',
        lastName: 'Board',
        email: testEmail,
        password: 'testpassword123'
    });
    await mockUser.save();
    
    // Create JWT
    const token = jwt.sign(
        { id: mockUser._id, email: mockUser.email },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Create Mock Transactions directly
    console.log('2. Inserting dynamic Income and Expense data...');
    await Transaction.insertMany([
        { userId: mockUser._id, type: 'income', amount: 5000, category: 'Salary' },
        { userId: mockUser._id, type: 'expense', amount: 1500, category: 'Rent' }
    ]);

    // Test GET /api/transactions via HTTP like the Frontend does
    console.log('\n3. Testing GET /api/transactions API Response...');
    const txRes = await fetch('http://localhost:5000/api/transactions', {
        headers: { 'x-auth-token': token }
    });

    const txData = await txRes.json();
    console.log('API Status:', txRes.status);
    
    if (txRes.status === 200 && txData.length === 2) {
        console.log('SUCCESS: API securely fetched 2 transactions belonging exactly to the logged in user!');
        console.log('Sample Transaction:', txData[0].category, '-', txData[0].amount);
    } else {
        console.log('FAILURE: API returned unexpected data:', txData);
    }

    // Cleanup
    console.log('\n4. Cleaning up database ecosystem...');
    await Transaction.deleteMany({ userId: mockUser._id });
    await User.findByIdAndDelete(mockUser._id);
    
    await mongoose.disconnect();
    console.log('Cleanup Complete.');

  } catch (err) {
    console.error('Verification flow crashed:', err);
  }
}

verifyDashboardData();
