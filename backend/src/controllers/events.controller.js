const prisma = require('../prismaClient');

module.exports = {
  // Create a new event
  createEvent: async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        date,
        durationHours,
        locationText,
        lat,
        lng,
        skillsRequired,
        maxVolunteers,
        posterUrl
      } = req.body;

      // Ensure user is an organiser
      if (req.user.role !== 'ORGANISER') {
        return res.status(403).json({ error: 'Only organisers can create events' });
      }

      // Find the organisation associated with this user
      const organisation = await prisma.organisation.findUnique({
        where: { organiserId: req.user.id }
      });

      if (!organisation) {
        return res.status(400).json({ error: 'You must create an organisation profile first' });
      }

      const event = await prisma.event.create({
        data: {
          title,
          description,
          category,
          date: new Date(date),
          durationHours: parseFloat(durationHours),
          locationText,
          lat: lat ? parseFloat(lat) : null,
          lng: lng ? parseFloat(lng) : null,
          skillsRequired,
          maxVolunteers: parseInt(maxVolunteers),
          posterUrl,
          organisationId: organisation.id,
          postedById: req.user.id
        }
      });

      res.status(201).json(event);
    } catch (error) {
      console.error('Create Event Error:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  },

  // List all events with optional filters
  listEvents: async (req, res) => {
    try {
      const { category, location, search } = req.query;

      const where = {};

      if (category) {
        where.category = category;
      }

      if (location) {
        where.locationText = { contains: location };
      }

      if (search) {
        where.OR = [
          { title: { contains: search } },
          { description: { contains: search } }
        ];
      }

      const events = await prisma.event.findMany({
        where,
        include: {
          organisation: {
            select: { name: true, logoUrl: true }
          }
        },
        orderBy: { date: 'asc' }
      });

      res.json(events);
    } catch (error) {
      console.error('List Events Error:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  },

  // Get a single event by ID
  getEvent: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('DEBUG: getEvent called with ID:', id);
      const event = await prisma.event.findUnique({
        where: { id: parseInt(id) },
        include: {
          organisation: true,
          postedBy: {
            select: { name: true, email: true }
          }
        }
      });
      console.log('DEBUG: getEvent result:', event ? 'Found' : 'Not Found');

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Check if the current user has already applied (if authenticated)
      let hasApplied = false;
      if (req.user) {
        const existingSignup = await prisma.eventSignup.findFirst({
          where: {
            eventId: parseInt(id),
            volunteerId: req.user.id
          }
        });
        hasApplied = !!existingSignup;
      }

      res.json({ ...event, hasApplied });
    } catch (error) {
      console.error('Get Event Error:', error);
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  },

  // Update an event
  updateEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;

      // Check ownership
      const existingEvent = await prisma.event.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (existingEvent.postedById !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this event' });
      }

      // Handle date conversion if present
      if (data.date) {
        data.date = new Date(data.date);
      }
      if (data.durationHours) data.durationHours = parseFloat(data.durationHours);
      if (data.maxVolunteers) data.maxVolunteers = parseInt(data.maxVolunteers);
      if (data.lat) data.lat = parseFloat(data.lat);
      if (data.lng) data.lng = parseFloat(data.lng);

      const updatedEvent = await prisma.event.update({
        where: { id: parseInt(id) },
        data
      });

      res.json(updatedEvent);
    } catch (error) {
      console.error('Update Event Error:', error);
      res.status(500).json({ error: 'Failed to update event' });
    }
  },

  // Delete an event
  deleteEvent: async (req, res) => {
    try {
      const { id } = req.params;

      // Check ownership
      const existingEvent = await prisma.event.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (existingEvent.postedById !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to delete this event' });
      }

      await prisma.event.delete({
        where: { id: parseInt(id) }
      });

      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Delete Event Error:', error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  },

  listMyEvents: async (req, res) => {
    try {
      const events = await prisma.event.findMany({
        where: { postedById: req.user.id },
        orderBy: { date: 'desc' }
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch your events' });
    }
  },

  applyToEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const volunteerId = req.user.id;

      console.log('DEBUG applyToEvent: User ID:', req.user.id, 'Role:', req.user.role);

      // Check if user is a volunteer
      if (req.user.role !== 'VOLUNTEER') {
        console.log('DEBUG applyToEvent: User is not a volunteer, role is:', req.user.role);
        return res.status(403).json({ error: 'Only volunteers can apply to events' });
      }

      // Get event details
      const event = await prisma.event.findUnique({
        where: { id: parseInt(id) }
      });

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Check if event is full
      if (event.currentVolCount >= event.maxVolunteers) {
        return res.status(400).json({ error: 'Event is full' });
      }

      // Check if already applied
      const existingSignup = await prisma.eventSignup.findFirst({
        where: {
          eventId: parseInt(id),
          volunteerId: volunteerId
        }
      });

      if (existingSignup) {
        return res.status(400).json({ error: 'You have already applied to this event' });
      }

      // Create signup and increment volunteer count
      const signup = await prisma.eventSignup.create({
        data: {
          eventId: parseInt(id),
          volunteerId: volunteerId,
          status: 'REGISTERED'
        },
        include: {
          event: {
            select: { title: true, date: true }
          }
        }
      });

      // Increment current volunteer count
      await prisma.event.update({
        where: { id: parseInt(id) },
        data: { currentVolCount: { increment: 1 } }
      });

      res.status(201).json(signup);
    } catch (error) {
      console.error('Apply to Event Error:', error);
      res.status(500).json({ error: 'Failed to apply to event' });
    }
  },

  getEventSignups: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if user is the event organiser
      const event = await prisma.event.findUnique({
        where: { id: parseInt(id) }
      });

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.postedById !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to view signups' });
      }

      const signups = await prisma.eventSignup.findMany({
        where: { eventId: parseInt(id) },
        include: {
          volunteer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              skills: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(signups);
    } catch (error) {
      console.error('Get Event Signups Error:', error);
      res.status(500).json({ error: 'Failed to fetch signups' });
    }
  }
};
