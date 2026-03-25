const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables. First try the local .env, then fallback to root if needed.
const localEnvPath = path.join(__dirname, '.env');
const rootEnvPath = path.join(__dirname, '../.env');

dotenv.config({ path: localEnvPath });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: rootEnvPath });
}
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/splits', require('./routes/splits'));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in the .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully...');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
