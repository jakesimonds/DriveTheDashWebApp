import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(__dirname, 'mydb.sqlite3');
const schemaPath = path.join(__dirname, 'schema.sql');

const readFile = promisify(fs.readFile);

async function initDb() {
  const db = new sqlite3.Database(dbPath);
  const schema = await readFile(schemaPath, { encoding: 'utf-8' });

  db.serialize(() => {
    db.exec(schema, (error) => {
      if (error) {
        console.error("Could not initialize the database:", error);
        return;
      }
      console.log("Database initialized successfully.");
    });
  });

  db.close();
}

initDb();
