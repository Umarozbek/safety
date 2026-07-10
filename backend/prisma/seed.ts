import { PrismaClient, UserRole, WorkerRole, CityStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const TEST_PIN = '1234';

async function main() {
  const passwordHash = await bcrypt.hash(TEST_PIN, 10);

  const boss = await prisma.user.upsert({
    where: { username: 'boss' },
    update: {},
    create: {
      username: 'boss',
      passwordHash,
      role: UserRole.BOSS,
    },
  });

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const city = await prisma.city.upsert({
    where: { name: 'Busan' },
    update: {},
    create: {
      name: 'Busan',
      status: CityStatus.ACTIVE_INSTALLED,
    },
  });

  const team = await prisma.team.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Busan Team 1',
      cityId: city.id,
    },
  });

  const workerUser = await prisma.user.upsert({
    where: { username: 'worker' },
    update: {},
    create: {
      username: 'worker',
      passwordHash,
      role: UserRole.WORKER,
    },
  });

  await prisma.worker.upsert({
    where: { userAccountId: workerUser.id },
    update: {},
    create: {
      name: 'Test Worker',
      phone: '010-0000-0000',
      teamId: team.id,
      role: WorkerRole.INSTALLATION,
      userAccountId: workerUser.id,
    },
  });

  console.log('Seeded test users (PIN for all: ' + TEST_PIN + ')');
  console.log('  BOSS:   ', boss.username);
  console.log('  ADMIN:  ', admin.username);
  console.log('  WORKER: ', workerUser.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
