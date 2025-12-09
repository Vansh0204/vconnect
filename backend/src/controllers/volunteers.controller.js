const prisma = require('../prismaClient');

module.exports = {
    // Get volunteer profile
    getProfile: async (req, res) => {
        try {
            const volunteer = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    city: true,
                    state: true,
                    country: true,
                    skills: true,
                    totalHours: true,
                    createdAt: true
                }
            });

            if (!volunteer) {
                return res.status(404).json({ error: 'Profile not found' });
            }

            res.json(volunteer);
        } catch (error) {
            console.error('Get Profile Error:', error);
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    },

    // Update volunteer profile
    updateProfile: async (req, res) => {
        try {
            const { name, phone, city, state, country, skills } = req.body;

            const updatedVolunteer = await prisma.user.update({
                where: { id: req.user.id },
                data: {
                    name,
                    phone,
                    city,
                    state,
                    country,
                    skills
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    city: true,
                    state: true,
                    country: true,
                    skills: true,
                    totalHours: true
                }
            });

            res.json(updatedVolunteer);
        } catch (error) {
            console.error('Update Profile Error:', error);
            res.status(500).json({ error: 'Failed to update profile' });
        }
    },

    // Get volunteer's signed-up events
    getMySignups: async (req, res) => {
        try {
            const signups = await prisma.eventSignup.findMany({
                where: { volunteerId: req.user.id },
                include: {
                    event: {
                        include: {
                            organisation: {
                                select: { name: true, logoUrl: true }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            res.json(signups);
        } catch (error) {
            console.error('Get My Signups Error:', error);
            res.status(500).json({ error: 'Failed to fetch your events' });
        }
    },

    // Cancel event signup
    cancelSignup: async (req, res) => {
        try {
            const { id } = req.params;

            // Find signup and verify ownership
            const signup = await prisma.eventSignup.findUnique({
                where: { id: parseInt(id) },
                include: { event: true }
            });

            if (!signup) {
                return res.status(404).json({ error: 'Signup not found' });
            }

            if (signup.volunteerId !== req.user.id) {
                return res.status(403).json({ error: 'Not authorized to cancel this signup' });
            }

            // Delete signup and decrement volunteer count
            await prisma.eventSignup.delete({
                where: { id: parseInt(id) }
            });

            await prisma.event.update({
                where: { id: signup.eventId },
                data: { currentVolCount: { decrement: 1 } }
            });

            res.json({ message: 'Signup cancelled successfully' });
        } catch (error) {
            console.error('Cancel Signup Error:', error);
            res.status(500).json({ error: 'Failed to cancel signup' });
        }
    }
};
