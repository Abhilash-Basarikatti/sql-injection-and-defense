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
| Frontend   | JS, HTML, CSS         |
| Backend    | Node.js, Express.js    |
| Database   | MySQL                  |
| ORM/Security | mysql2 (prepared queries), validator.js |



---

## 📦 Setup Locally

To run the project locally:

```bash
git clone https://github.com/yourusername/sql-injection-project.git
cd sql-injection-project
npm install
npm start
```
## 🛠️ How to Use the Project

### ✅ Valid Login (Both Systems)
Username: admin
Password: admin123


### ⚠️ SQL Injection Bypass (Only in Vulnerable)

Test the following inputs in the **vulnerable login page**:

- Username: admin' #
- Username: admin' OR '1'='1
- Username: admin' OR 'a'='a
- Username: ' UNION SELECT null, null, database()--
- Username: ' OR ''='
- password:anythinng


- ✅ These inputs will **bypass** the login in the vulnerable system due to unsanitized SQL queries.
- 🔒 They will **fail** in the secure system, which uses **prepared statements** (parameterized queries).
