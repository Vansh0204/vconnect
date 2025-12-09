const express = require('express');
const router = express.Router();
const { getDashboardStats, updateSignupStatus, createProfile } = require('../controllers/organiser.controller');
const auth = require('../middleware/auth.middleware');

// All routes require authentication
router.post('/profile', auth, createProfile);
router.get('/stats', auth, getDashboardStats);
router.patch('/signups/:id/status', auth, updateSignupStatus);

module.exports = router;
