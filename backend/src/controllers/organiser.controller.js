const prisma = require('../prismaClient');

module.exports = {
    // Get dashboard stats
    getDashboardStats: async (req, res) => {
        try {
            const organiserId = req.user.id;

            // Get organisation
            const organisation = await prisma.organisation.findUnique({
                where: { organiserId }
            });

            if (!organisation) {
                return res.status(404).json({ error: 'Organisation not found' });
            }

            // Get total events
            const totalEvents = await prisma.event.count({
                where: { organisationId: organisation.id }
            });

            // Get active events (upcoming)
            const activeEvents = await prisma.event.count({
                where: {
                    organisationId: organisation.id,
                    date: { gte: new Date() }
                }
            });

            // Get total volunteers (unique signups)
            const totalVolunteers = await prisma.eventSignup.count({
                where: {
                    event: { organisationId: organisation.id }
                }
            });

            // Get recent events
            const recentEvents = await prisma.event.findMany({
                where: { organisationId: organisation.id },
                orderBy: { date: 'desc' },
                take: 5,
                include: {
                    _count: {
                        select: { signups: true }
                    }
                }
            });

            res.json({
                totalEvents,
                activeEvents,
                totalVolunteers,
                recentEvents
            });
        } catch (error) {
            console.error('Get Dashboard Stats Error:', error);
            res.status(500).json({ error: 'Failed to fetch stats' });
        }
    },

    // Update signup status
    updateSignupStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body; // APPROVED, REJECTED, ATTENDED

            // Validate status
            const validStatuses = ['REGISTERED', 'WAITLIST', 'ATTENDED', 'REJECTED'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }

            // Find signup and verify ownership
            const signup = await prisma.eventSignup.findUnique({
                where: { id: parseInt(id) },
                include: {
                    event: true
                }
            });

            if (!signup) {
                return res.status(404).json({ error: 'Signup not found' });
            }

            // Check if user is the event organiser
            if (signup.event.postedById !== req.user.id) {
                return res.status(403).json({ error: 'Not authorized to update this signup' });
            }

            // Update status
            const updatedSignup = await prisma.eventSignup.update({
                where: { id: parseInt(id) },
                data: { status },
                include: {
                    volunteer: {
                        select: { name: true, email: true }
                    }
                }
            });

            // If marked as ATTENDED, increment volunteer hours
            if (status === 'ATTENDED' && signup.status !== 'ATTENDED') {
                const hours = signup.event.durationHours || 0;

                // Update signup hours
                await prisma.eventSignup.update({
                    where: { id: parseInt(id) },
                    data: { hoursLogged: hours }
                });

                // Update volunteer total hours
                await prisma.user.update({
                    where: { id: signup.volunteerId },
                    data: { totalHours: { increment: hours } }
                });
            }

            res.json(updatedSignup);
        } catch (error) {
            console.error('Update Signup Status Error:', error);
            res.status(500).json({ error: 'Failed to update status' });
        }
    },

    // Create organisation profile
    createProfile: async (req, res) => {
        try {
            const { name, description, website, logoUrl } = req.body;
            const organiserId = req.user.id;

            // Check if profile already exists
            const existingProfile = await prisma.organisation.findUnique({
                where: { organiserId }
            });

            if (existingProfile) {
                return res.status(400).json({ error: 'Organisation profile already exists' });
            }

            const organisation = await prisma.organisation.create({
                data: {
                    name,
                    description,
                    website,
                    logoUrl,
                    organiserId
                }
            });

            res.status(201).json(organisation);
        } catch (error) {
            console.error('Create Profile Error:', error);
            res.status(500).json({ error: 'Failed to create profile' });
        }
    }
};
