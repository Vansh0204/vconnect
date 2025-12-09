const prisma = require('./backend/src/prismaClient');

async function main() {
    try {
        const id = "3";
        console.log('Searching for ID:', parseInt(id));

        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) },
            include: {
                organisation: true,
                postedBy: {
                    select: { name: true, email: true }
                }
            }
        });

        console.log('Result:', event);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
