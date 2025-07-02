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

## 🧪 SQL Injection Attack Types – Vulnerable vs. Secure Login System

| S.No | Attack Type                     | Example Payload                                   | Detected (Vulnerable) | Bypassed (Vulnerable) | Detected (Secure) | Bypassed (Secure) |
|------|----------------------------------|--------------------------------------------------|------------------------|------------------------|--------------------|--------------------|
| 1    | Comment Injection                | `admin' #`                                       | ✗                      | ✓                      | ✓                  | ✗                  |
| 2    | Tautology Injection              | `admin' OR 'a'='a`                               | ✗                      | ✓                      | ✓                  | ✗                  |
| 3    | Tautology Injection              | `admin' OR '1'='1`                               | ✗                      | ✓                      | ✓                  | ✗                  |
| 4    | Tautology + Comment              | `' OR '1'='1'#`                                  | ✗                      | ✓                      | ✓                  | ✗                  |
| 5    | Tautology with Empty String      | `admin' OR ''='`                                 | ✗                      | ✓                      | ✓                  | ✗                  |
| 6    | Numeric Tautology Injection      | `admin' OR 1 = 1#`                               | ✗                      | ✓                      | ✓                  | ✗                  |
| 7    | Union-Based Injection            | `' UNION SELECT NULL, NULL--`                    | ✗                      | ✓                      | ✓                  | ✗                  |
| 8    | Error-Based Injection            | `' AND 1=CONVERT(int, (SELECT @@version))--`     | ✗                      | ✗                       | ✓                  | ✗                  |
| 9    | Blind Boolean Injection (True)   | `' AND 1=1--`                                    | ✗                      | ✗                       | ✓                  | ✗                  |
| 10   | Blind Boolean Injection (False)  | `' AND 1=2--`                                    | ✗                      | ✗                       | ✓                  | ✗                  |
| 11   | Time-Based Blind Injection       | `' OR IF(1=1, SLEEP(5), 0)--`                     | ✗                     | ✗                      | ✓                  | ✗                  |
| 12   | Stacked Queries Injection        | `admin'; DROP TABLE users;--`                    | ✗                      | ✗                      | ✓                  | ✗                  |


## 📦 Setup Locally

To run the project locally:

```bash
git clone https://github.com/yourusername/sql-injection-project.git
cd sql-injection-project
npm install
npm start
```
make sure wamp server is running
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

---
### 🌐 Accessing the Application

Once the server is running, you can access the application at:

- 🔓 **Main Page (Both Systems)**  
  [http://localhost:3000/](http://localhost:3000/)  
  - Vulnerable Login
  - Secure Login

- 🧾 **View Logs (Suspicious Inputs)**  
  [http://localhost:3000/view-logs](http://localhost:3000/view-logs)  
  → Displays all recorded suspicious login attempts  
  → Admins can review and block malicious users based on patterns

