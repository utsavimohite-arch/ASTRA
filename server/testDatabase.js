
const db = require("./database/db");

const tables = db.prepare(`
  SELECT name
  FROM sqlite_master
  WHERE type = 'table'
`).all();

console.log("Database tables:", tables);

db.close();
