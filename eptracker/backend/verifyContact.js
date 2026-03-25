const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Contact = require('./models/Contact');

dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

async function verify() {
  try {
    const testEmail = `tester_${Date.now()}@example.com`;
    const payload = {
      name: 'Test Contact',
      email: testEmail,
      message: 'Hello, this is a test message to ensure the DB connection works!'
    };

    console.log('1. Sending POST request to /api/contact...');
    const res = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('Response Status:', res.status);
    console.log('Response Body:', data);

    if (res.status === 201) {
      console.log('\n2. Connecting to MongoDB to verify insertion...');
      await mongoose.connect(process.env.MONGO_URI);
      
      const dbContact = await Contact.findOne({ email: testEmail });
      if (dbContact) {
        console.log('SUCCESS: Contact found in database!');
        console.log('DB Record:', dbContact);
        
        console.log('\n3. Cleaning up test contact from DB...');
        await Contact.deleteOne({ email: testEmail });
        console.log('Cleanup complete.');
      } else {
        console.log('FAILURE: Contact not found in database despite 201 response.');
      }
      
      await mongoose.disconnect();
    } else {
      console.log('Contact request failed, cannot verify DB insertion.');
    }
  } catch (err) {
    console.error('Verification failed:', err);
  }
}

verify();
