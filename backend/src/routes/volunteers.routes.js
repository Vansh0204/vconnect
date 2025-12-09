const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getMySignups, cancelSignup } = require('../controllers/volunteers.controller');
const auth = require('../middleware/auth.middleware');

// All routes require authentication
router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);
router.get('/my-events', auth, getMySignups);
router.delete('/signups/:id', auth, cancelSignup);

module.exports = router;
