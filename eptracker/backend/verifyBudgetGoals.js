const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const BudgetGoal = require('./models/BudgetGoal');
const jwt = require('jsonwebtoken');

dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_exisyfi';

async function verifyGoalsFlow() {
  try {
    const testEmail = `goal_test_${Date.now()}@example.com`;

    console.log('1. Setting up MongoDB ecosystem test user...');
    await mongoose.connect(process.env.MONGO_URI);
    
    // Create Mock User
    const mockUser = new User({
        firstName: 'Data',
        lastName: 'GoalTester',
        email: testEmail,
        password: 'securepassword123'
    });
    await mockUser.save();
    
    // Create JWT
    const token = jwt.sign({ id: mockUser._id, email: mockUser.email }, JWT_SECRET, { expiresIn: '1h' });

    // Test POST /api/goals 
    console.log('\n2. Testing POST /api/goals Integration mapping...');
    const postRes = await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify({
            targetAmount: 10000,
            category: 'New Car',
            duration: 'Yearly'
        })
    });

    const postData = await postRes.json();
    console.log('POST Status:', postRes.status);
    
    if (postRes.status === 201) {
        console.log('SUCCESS: Goal dynamically tracked directly to MongoDB!');
        console.log('Document Details:', postData.category, '- Target $', postData.targetAmount);

        // Verify with GET immediately
        console.log('\n3. Verifying GET /api/goals Array...');
        const getRes = await fetch('http://localhost:5000/api/goals', { headers: { 'x-auth-token': token } });
        const getData = await getRes.json();
        
        if (getData.length === 1 && getData[0].category === 'New Car') {
            console.log('SUCCESS: GET retrieval confirmed persistent! Native UI `.map()` will accurately perform Progress Bar geometry parameters.');
        } else {
            console.log('FAILURE on GET fetch test.');
        }

    } else {
        console.log('FAILURE: API rejected extraction. Ensure server.js was restarted so it recognizes the Route!', postData);
    }

    // Cleanup
    console.log('\n4. Cleaning up database ecosystem...');
    await BudgetGoal.deleteMany({ userId: mockUser._id });
    await User.findByIdAndDelete(mockUser._id);
    await mongoose.disconnect();
    console.log('Cleanup Complete.');

  } catch (err) {
    console.error('Verification flow crashed:', err);
  }
}

verifyGoalsFlow();
