import { Pool } from "pg";

export const postgresPool = new Pool({
  host: "localhost",
  port: 5432,
  min: 0,
  max: 0xffff,
  password: "yacine123",
  user: "postgres",
  database: "beacon",
});
