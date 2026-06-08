const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const config = require('../config/database');

let db = null;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  const dbPath = path.resolve(config.databasePath);

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA journal_mode=WAL');
  db.run('PRAGMA foreign_keys=ON');

  return db;
}

function saveDb() {
  if (!db) return;
  const dbPath = path.resolve(config.databasePath);
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDb, saveDb, closeDb };
