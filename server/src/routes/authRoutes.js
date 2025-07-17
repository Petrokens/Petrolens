const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken'); // Middleware to verify JWT
const rateLimit = require('express-rate-limit');
const requireRole = require('../middleware/requireRole');
// Limit login attempts per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,                  // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts. Please try again after 15 minutes.'
});

//Private Routes
// router.post('/register',verifyToken,requireRole([1]), auth.register);
router.post('/register', auth.register);

// Public routes
router.post('/login', loginLimiter, auth.login);
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password', auth.resetPassword);

// Protected routes
router.post('/logout', verifyToken, auth.logout);
router.post('/refresh', auth.refresh); // Optional to protect with token

module.exports = router;
