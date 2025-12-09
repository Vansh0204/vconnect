const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const orgRoutes = require('./routes/org.routes');
const eventsRoutes = require('./routes/events.routes');
const volunteersRoutes = require('./routes/volunteers.routes');
const organiserRoutes = require('./routes/organiser.routes');
const messagesRoutes = require('./routes/messages.routes');
const communityRoutes = require('./routes/community.routes');
const authMiddleware = require('./middleware/auth.middleware');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://volunteer-ten-theta.vercel.app'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/organiser', organiserRoutes);
app.use('/api/messages', authMiddleware, messagesRoutes);
app.use('/api/community', communityRoutes);

app.get('/', (req, res) => {
  res.send({ status: 'OK', message: 'Volunteer Connect API running' });
});

module.exports = app;
