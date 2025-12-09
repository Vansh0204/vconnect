const express = require('express');
const router = express.Router();
const { registerVolunteer, registerOrganisation, login } = require('../controllers/auth.controller');

router.post('/register-volunteer', registerVolunteer);
router.post('/register-organisation', registerOrganisation);
router.post('/login', login);

module.exports = router;