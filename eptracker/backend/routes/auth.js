const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const LoginUser = require('../models/LoginUser');
const { OAuth2Client } = require('google-auth-library');
const auth = require('../middleware/auth');

// Use a secret from .env if possible, fallback for local dev
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_exisyfi';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

// POST /api/auth/google
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const { sub: googleId, email, given_name: firstName, family_name: lastName, picture: image } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ firstName, lastName, email, googleId, image });
      await user.save();
    } else if (!user.googleId) {
      // Link Google ID if email matches but it was a manual registration before
      user.googleId = googleId;
      if (!user.image) user.image = image;
      await user.save();
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });

    // Track login session
    const activeSession = new LoginUser({ userId: user._id, email: user.email, token });
    await activeSession.save();

    res.json({
      message: 'Logged in with Google successfully',
      token,
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, image: user.image }
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(400).json({ message: 'Google authentication failed' });
  }
});

// PUT /api/auth/update-password
router.put('/update-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If user registered with Google and never set a password, they won't have one
    if (!user.password && user.googleId) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      return res.json({ message: 'Password set successfully' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update Password Error:', err);
    res.status(500).json({ message: 'Server error' });
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
