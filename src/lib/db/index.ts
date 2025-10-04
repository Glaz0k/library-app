import * as schema from './schema';
import { drizzle } from 'drizzle-orm/node-postgres';

export * from './schema';

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
  },
  schema,
});
