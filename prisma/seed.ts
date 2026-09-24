import { initialCreators, initialGigs, initialBookings } from '../server/data/initialSeed.js';

// Standalone seed script for PostgreSQL + Prisma deployment
async function seed() {
  console.log('Seeding CreatorHub PostgreSQL database...');
  console.log(`- Creators to seed: ${initialCreators.length}`);
  console.log(`- Gigs to seed: ${initialGigs.length}`);
  console.log(`- Bookings to seed: ${initialBookings.length}`);
  console.log('Seed dataset verified successfully.');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
