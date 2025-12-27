import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter: adapter });

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      username: 'alice',
      email: 'alice@example.com',
      profile: {
        create: {
          bio: 'Alice bio',
        },
      },
      posts: {
        create: [
          {
            caption: 'Alice first post',
            img: 'alice1.jpg',
            size: 'big',
            type: 'image',
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'bob',
      email: 'bob@example.com',
      profile: {
        create: {
          bio: 'Bob bio',
        },
      },
      posts: {
        create: [
          {
            caption: 'Bob first post',
            img: 'bob1.jpg',
            size: 'big',
            type: 'image',
          },
          {
            caption: 'Bob second post',
            img: 'bob2.jpg',
            size: 'tiny',
            type: 'image',
          },
        ],
      },
    },
  });

  console.log('Seeded users:', user1.username, user2.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
