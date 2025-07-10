const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken'); // Middleware to verify JWT
const rateLimit = require('express-rate-limit');

// Limit login attempts per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                   // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts. Please try again after 15 minutes.'
});

// Public routes
router.post('/register', auth.register);
router.post('/login', loginLimiter, auth.login);
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password', auth.resetPassword);

// Protected routes
router.post('/logout', verifyToken, auth.logout);
router.post('/refresh', auth.refresh); // Optional to protect with token

module.exports = router;
