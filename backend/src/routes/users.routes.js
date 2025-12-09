const express = require('express');
const router = express.Router();
const { searchUsers } = require('../controllers/users.controller');

router.get('/search', searchUsers);

module.exports = router;
