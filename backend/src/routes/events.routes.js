const express = require('express');
const router = express.Router();
const { listEvents, applyToEvent, createEvent, listMyEvents, getEventSignups, getEvent, updateEvent, deleteEvent } = require('../controllers/events.controller');
const auth = require('../middleware/auth.middleware');
const { optionalAuth } = require('../middleware/auth.middleware');

router.get('/', listEvents);
router.post('/', auth, createEvent);
router.get('/mine', auth, listMyEvents);
router.get('/:id', optionalAuth, getEvent);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);
router.post('/:id/apply', auth, applyToEvent);
router.get('/:id/signups', auth, getEventSignups);

module.exports = router;
