import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

export const query = async (text: string, params?: any[]) => {
  const { rows } = await pool.query(text, params);
  return rows;
};

export const initializeDb = async () => {
  await pool.query(`
    DROP TABLE IF EXISTS entities CASCADE;
    DROP TABLE IF EXISTS interactions CASCADE;
    CREATE TABLE IF NOT EXISTS entities (
      id VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      company VARCHAR NOT NULL
    );
    CREATE TABLE IF NOT EXISTS interactions (
      id SERIAL PRIMARY KEY,
      source_id VARCHAR REFERENCES entities(id),
      target_id VARCHAR REFERENCES entities(id),
      type VARCHAR NOT NULL,
      timestamp VARCHAR NOT NULL,
      description VARCHAR NOT NULL
    );
  `);
  await pool.query(`
    INSERT INTO entities (id, name, company) VALUES
    ('1', 'Alice Rogers', 'Acme Co'),
    ('2', 'Bob Arlo', 'Luna Inc'),
    ('3', 'Diana Evans', 'Cent Corp'),
    ('4', 'Chuck Davies', 'Alpha')
    ON CONFLICT DO NOTHING;
    INSERT INTO interactions (source_id, target_id, type, timestamp, description) VALUES
    ('1', '2', 'Phone', '01/12/2025 10:03AM', 'Called to ask about the status of the deal'),
    ('1', '3', 'Email', '01/12/2025 10:03AM', 'Sent status update on project milestones'),
    ('3', '1', 'Message', '01/12/2025 10:03AM', 'Discussed contract terms and timeline'),
    ('2', '4', 'Email', '01/12/2025 10:03AM', 'Sent updated proposal documents')
    ON CONFLICT DO NOTHING;
  `);
};