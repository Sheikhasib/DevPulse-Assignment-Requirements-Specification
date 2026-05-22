import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.database_url,
});

export const initDB = async () => {
  try {
    await pool.query(
      `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,

            role VARCHAR(20) NOT NULL DEFAULT 'contributor',

            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
       `,
    );

    await pool.query(
      `
            CREATE TABLE IF NOT EXISTS issues (
            id SERIAL PRIMARY KEY,

            title VARCHAR(150) NOT NULL,
            description TEXT NOT NULL,
            type VARCHAR(20) NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'open',

            reporter_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
        `,
    );

    console.log("Database Connected Successfully!!!");
  } catch (error) {
    console.log(error);
  }
};
