const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', 'data', 'portfolio.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        company TEXT NOT NULL,
        service TEXT NOT NULL,
        budget REAL,
        message TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    db.run('CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC)');
  });
}

function createClient(client) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO clients (name, email, company, service, budget, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [client.name, client.email, client.company, client.service, client.budget, client.message],
      function onInsert(error) {
        if (error) {
          reject(error);
          return;
        }

        resolve({ id: this.lastID, ...client });
      }
    );
  });
}

function listClients(limit = 5) {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT id, name, email, company, service, budget, message, created_at AS createdAt
      FROM clients
      ORDER BY datetime(created_at) DESC
      LIMIT ?
      `,
      [limit],
      (error, rows) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(rows);
      }
    );
  });
}

module.exports = {
  db,
  initializeDatabase,
  createClient,
  listClients
};
