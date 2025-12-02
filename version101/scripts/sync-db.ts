import { syncDatabase } from '@/models';

syncDatabase()
  .then(() => {
    console.log('Database sync completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database sync failed:', error);
    process.exit(1);
  });