import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // ลบข้อมูลเก่าก่อน (Optional)
    // await prisma.task.deleteMany();

    const initialTasks = [
        {
            title: 'ชื่อ',
            description: 'นายชยานันต์ หล้ากาศ',
        },
        {
            title: 'รหัสนศ',
            description: '6604101403',
        },
        {
            title: 'Cloud Deployment',
            description: 'Deploy Backend to Render and Frontend to Netlify',
        },
    ];

    for (const t of initialTasks) {
        const task = await prisma.task.create({
            data: t,
        });
        console.log(`Created task with id: ${task.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
