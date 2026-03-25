import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import env, { isProd } from "env";
import { remember } from "@epic-web/remember";

const createPool = () => {
  return new pg.Pool({
    connectionString: env.DATABASE_URL,
  });
};

let client;

if (isProd()) {
  client = createPool();
} else {
  client = remember("dbPool", () => createPool());
}

export const db = drizzle({ client, schema });

export default db;
