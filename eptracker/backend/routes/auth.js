const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const LoginUser = require('../models/LoginUser');

// Use a secret from .env if possible, fallback for local dev
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_exisyfi';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Industrial Practice: Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: { id: newUser._id, email: newUser.email } });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body; // userId maps to email

    if (!userId || !password) {
      return res.status(400).json({ message: 'Please provide both User ID and Password' });
    }

    // Find the user by email
    const user = await User.findOne({ email: userId });
    if (!user) {
      return res.status(400).json({ message: 'Invalid User ID or Password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // NOTE: We could have plain text passwords from before we added bcrypt! Check fallback.
      if (password !== user.password) {
        return res.status(400).json({ message: 'Invalid User ID or Password' });
      }
    }

    // Sign a JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Save active login session to "loginusers" collection
    const activeSession = new LoginUser({
      userId: user._id,
      email: user.email,
      token: token
    });
    await activeSession.save();

    res.status(200).json({ 
      message: 'Logged in successfully', 
      token, 
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName } 
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
