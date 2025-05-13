const mysql = require('mysql2');

// Initial connection (no DB selected)
const rootConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true
});

// Step 1: Create database, users table, and blocked_ips table
rootConnection.query(`
  CREATE DATABASE IF NOT EXISTS sql_demo;
  USE sql_demo;
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255)
  );
  CREATE TABLE IF NOT EXISTS blocked_ips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) UNIQUE,
    blocked_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`, (err) => {
  if (err) throw err;
  console.log("✅ Database, users, and blocked_ips tables ready.");

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sql_demo'
  });

  connection.query(
    `SELECT * FROM users WHERE username = ?`,
    ['admin'],
    (err, results) => {
      if (err) throw err;

      if (results.length === 0) {
        connection.query(
          `INSERT INTO users (username, password) VALUES (?, ?)`,
          ['admin', 'admin123'],
          (err) => {
            if (err) throw err;
            console.log("✅ Admin user inserted.");
          }
        );
      } else {
        console.log("ℹ️ Admin user already exists. Skipping insert.");
      }
    }
  );
});

// Export final connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sql_demo'
});

module.exports = connection;
