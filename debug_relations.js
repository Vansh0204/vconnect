const prisma = require('./backend/src/prismaClient');

async function main() {
    try {
        const user = await prisma.user.findUnique({ where: { id: 1 } });
        console.log('User 1:', user);

        const org = await prisma.organisation.findUnique({ where: { id: 1 } });
        console.log('Organisation 1:', org);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
