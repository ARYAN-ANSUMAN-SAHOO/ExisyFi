const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const SplitBill = require('./models/SplitBill');
const jwt = require('jsonwebtoken');

dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_exisyfi';

async function verifySplitFlow() {
  try {
    const testEmail = `split_test_${Date.now()}@example.com`;

    console.log('1. Setting up MongoDB ecosystem test user...');
    await mongoose.connect(process.env.MONGO_URI);
    
    const mockUser = new User({
        firstName: 'Split',
        lastName: 'Tester',
        email: testEmail,
        password: 'securepassword123'
    });
    await mockUser.save();
    
    const token = jwt.sign({ id: mockUser._id, email: mockUser.email }, JWT_SECRET, { expiresIn: '1h' });

    console.log('\n2. Testing POST /api/splits division logic...');
    // Testing $100 split 4 ways ($25 each)
    const postRes = await fetch('http://localhost:5000/api/splits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({
            description: 'Database Verification Dinner',
            totalAmount: 100,
            participants: 3, 
            includeMyself: true // So total divider = 4
        })
    });

    const postData = await postRes.json();
    console.log('POST Status:', postRes.status);
    
    if (postRes.status === 201) {
        console.log('SUCCESS: Split dynamically tracked!');
        console.log(`Document Detail - Pending share should be $25... It is: $${postData.pendingAmount}`);

        // Verify with GET immediately
        console.log('\n3. Verifying GET /api/splits Array logic for Pending status...');
        const getRes = await fetch('http://localhost:5000/api/splits', { headers: { 'x-auth-token': token } });
        const getData = await getRes.json();
        
        if (getData.length === 1 && getData[0].status === 'pending') {
            console.log('SUCCESS: GET retrieval confirmed persistent pending bill!');
            
            // Testing the Mark as Paid feature
            console.log('\n4. Testing PUT Mark As Paid Status Update...');
            const putRes = await fetch(`http://localhost:5000/api/splits/${getData[0]._id}/settle`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });

            const putData = await putRes.json();
            if (putData.status === 'settled') {
                console.log('SUCCESS: Bill was successfully marked as "settled" causing it to permanently disappear from UI queries!');
            } else {
                console.log('FAILURE on Mark as Paid.');
            }

        } else {
            console.log('FAILURE on GET fetch test.');
        }

    } else {
        console.log('FAILURE: API rejected extraction. Ensure server.js was restarted so it recognizes the Route!', postData);
    }

    // Cleanup
    console.log('\n5. Cleaning up database ecosystem...');
    await SplitBill.deleteMany({ userId: mockUser._id });
    await User.findByIdAndDelete(mockUser._id);
    await mongoose.disconnect();
    console.log('Cleanup Complete.');

  } catch (err) {
    console.error('Verification flow crashed:', err);
  }
}

verifySplitFlow();
