import Database from 'better-sqlite3';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const dbPath = process.env.DATABASE_PATH || './saj_pos.db';

// Ensure directory exists
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(dbPath, { verbose: console.log });
db.pragma('journal_mode = WAL');

export default db;
