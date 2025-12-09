const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
    // Create an organiser user
    const hashedPassword = await bcrypt.hash('demo123', 10);

    const organiser = await prisma.user.create({
        data: {
            name: 'Green Earth Admin',
            email: 'admin@greenearth.org',
            passwordHash: hashedPassword,
            role: 'ORGANISER',
            phone: '+91-9876543210',
            city: 'Chennai',
            state: 'Tamil Nadu',
            country: 'India'
        }
    });

    // Create organisation
    const organisation = await prisma.organisation.create({
        data: {
            name: 'Green Earth Foundation',
            description: 'Environmental conservation organization dedicated to protecting our planet',
            logoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200',
            verified: true,
            organiserId: organiser.id
        }
    });

    // Create sample events
    const events = await prisma.event.createMany({
        data: [
            {
                title: 'Beach Cleanup Drive 2025',
                description: 'Join us for a community beach cleanup event at Marina Beach. We will provide all equipment, gloves, and refreshments. Together we can make our beaches cleaner!',
                category: 'Environment',
                date: new Date('2025-01-15T09:00:00'),
                durationHours: 4,
                locationText: 'Marina Beach, Chennai',
                lat: 13.0499,
                lng: 80.2824,
                skillsRequired: 'Physical fitness, teamwork',
                maxVolunteers: 100,
                currentVolCount: 0,
                posterUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800',
                organisationId: organisation.id,
                postedById: organiser.id
            },
            {
                title: 'Tree Plantation Drive',
                description: 'Help us plant 500 trees in the local park. Every tree counts in our fight against climate change. Saplings and tools will be provided.',
                category: 'Environment',
                date: new Date('2025-01-20T07:00:00'),
                durationHours: 3,
                locationText: 'Nandanam Park, Chennai',
                lat: 13.0338,
                lng: 80.2405,
                skillsRequired: 'None',
                maxVolunteers: 75,
                currentVolCount: 0,
                posterUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
                organisationId: organisation.id,
                postedById: organiser.id
            },
            {
                title: 'Community Teaching Program',
                description: 'Teach underprivileged children basic English and Math. Make a difference in young lives. Teaching materials will be provided.',
                category: 'Education',
                date: new Date('2025-01-18T14:00:00'),
                durationHours: 2,
                locationText: 'Community Center, T. Nagar',
                maxVolunteers: 20,
                currentVolCount: 0,
                skillsRequired: 'Basic English, patience',
                organisationId: organisation.id,
                postedById: organiser.id
            }
        ]
    });

    console.log('✅ Seed data created successfully!');
    console.log(`Created organiser: ${organiser.email}`);
    console.log(`Created organisation: ${organisation.name}`);
    console.log(`Created 3 sample events`);
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
