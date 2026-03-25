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

async function verifyExpenseFlow() {
  try {
    const testEmail = `record_test_${Date.now()}@example.com`;

    console.log('1. Setting up MongoDB ecosystem test user...');
    await mongoose.connect(process.env.MONGO_URI);
    
    // Create Mock User
    const mockUser = new User({
        firstName: 'Record',
        lastName: 'ExpenseTest',
        email: testEmail,
        password: 'securepassword123'
    });
    await mockUser.save();
    
    // Create JWT
    const token = jwt.sign({ id: mockUser._id, email: mockUser.email }, JWT_SECRET, { expiresIn: '1h' });

    // Test POST /api/transactions 
    console.log('\n2. Testing POST /api/transactions Integration from Frontend Equivalent...');
    const postRes = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify({
            amount: 28.50,
            category: 'Food',
            merchant: 'Starbucks Test',
            date: new Date().toISOString().split('T')[0],
            type: 'expense'
        })
    });

    const postData = await postRes.json();
    console.log('POST Status:', postRes.status);
    
    if (postRes.status === 201) {
        console.log('SUCCESS: Expense dynamically tracked directly to MongoDB User!');
        console.log('Document Details:', postData.merchant, '- $', postData.amount);

        // Verify with GET immediately
        console.log('\n3. Verifying GET /api/transactions to ensure array renders back securely...');
        const getRes = await fetch('http://localhost:5000/api/transactions', { headers: { 'x-auth-token': token } });
        const getData = await getRes.json();
        
        if (getData.length === 1 && getData[0].merchant === 'Starbucks Test') {
            console.log('SUCCESS: GET retrieval confirmed persistent over static local memory!');
        } else {
            console.log('FAILURE on GET fetch test.');
        }

    } else {
        console.log('FAILURE: API rejected transaction insertion:', postData);
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

verifyExpenseFlow();
