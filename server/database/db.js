
const Database = require("better-sqlite3");
const path = require("path");

// Create or connect to the local database
const dbPath = path.join(__dirname, "astra.db");
const db = new Database(dbPath);

// Create the health records table
db.exec(`
  CREATE TABLE IF NOT EXISTS health_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    heart_rate REAL NOT NULL,
    systolic_bp REAL NOT NULL,
    diastolic_bp REAL NOT NULL,
    body_temperature REAL NOT NULL,
    glucose REAL,
    sleep_hours REAL,
    mood TEXT,
    stress_level INTEGER,
    symptoms TEXT,
    recorded_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log("ASTRA SQLite database connected successfully!");

module.exports = db;
