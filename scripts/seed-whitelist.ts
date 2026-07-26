import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'ehab.ayman.gh@gmail.com';
  const entry = await prisma.whitelistEntry.upsert({
    where: { email },
    update: {},
    create: {
      email,
      notes: 'Admin / Owner Whitelist Entry',
    },
  });
  console.log('Successfully whitelisted:', entry.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
