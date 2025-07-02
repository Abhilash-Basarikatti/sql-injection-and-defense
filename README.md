# 🔐 SQL Injection Detection & Prevention – Web Security Project

This project demonstrates both vulnerable and secure login systems to showcase how SQL injection attacks work and how to prevent them. Built with **Node.js**, **Express**, and **MySQL**, the system includes input sanitization, query logging, suspicious pattern detection, and a basic admin panel to simulate protected data access.

---

## ✨ Features

- ⚠️ Vulnerable login page (raw SQL queries)
- ✅ Secure login page (prepared statements)
- 🔍 SQL injection detection using pattern matching
- 🛡️ Logs suspicious login attempts (e.g., `' OR 1=1`, `--`, `UNION`)
- 📂 Admin panel with restricted access
- 📧 Email alert system (optional / future scope)
- 📜 Logging of IP address, timestamp, and attack vector

---

## 🧰 Tech Stack

| Layer      | Technology            |
|------------|------------------------|
| Backend    | Node.js, Express.js    |
| Database   | MySQL                  |
| ORM/Security | mysql2 (prepared queries), validator.js |
| Frontend   | EJS, HTML, CSS         |
| Logging    | fs, custom middleware  |
| Dev Tools  | Nodemon, dotenv        |

---

## 📦 Setup Locally

To run the project locally:

```bash
git clone https://github.com/yourusername/sql-injection-project.git
cd sql-injection-project
npm install
npm start
