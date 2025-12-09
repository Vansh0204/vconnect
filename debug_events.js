const prisma = require('./backend/src/prismaClient');

async function main() {
    try {
        const events = await prisma.event.findMany();
        console.log('Events in DB:', events);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
