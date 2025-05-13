const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const connection = require('./db');
const detectAttackType = require('./attackDetector');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'views')));

// 🔒 IP Blocking Middleware
// 🔒 IP Blocking Middleware
// 🔒 IP Blocking Middleware
app.use((req, res, next) => {
  const allowedPaths = ['/unblock-ip', '/view-logs', '/log-detail']; // admin-only paths
  const isAllowed = allowedPaths.some(path => req.path.startsWith(path));

  const ip = req.ip;

  connection.query('SELECT * FROM blocked_ips WHERE ip_address = ?', [ip], (err, results) => {
    if (err) {
      console.error('❌ Error checking blocked IP:', err);
      return res.status(500).send('Server error');
    }

    if (results.length > 0 && !isAllowed) {
      // 🚫 Hacker-style denial page
      return res.status(403).send(`
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 0;
                background: black;
                color: #00ff00;
                font-family: 'Courier New', Courier, monospace;
                overflow: hidden;
              }
              .matrix {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: -1;
              }
              .content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
              }
              h1 {
                font-size: 3em;
                text-shadow: 0 0 10px #0f0, 0 0 20px #0f0;
              }
              p {
                font-size: 1.2em;
              }
            </style>
          </head>
          <body>
            <canvas class="matrix"></canvas>
            <div class="content">
              <h1>🚫 ACCESS DENIED</h1>
              <p>Your IP <b>${ip}</b> has been <span style="color:red">BLACKLISTED</span>.</p>
              <p>🔒 Security breach attempt detected. This incident has been logged.</p>
            </div>

            <script>
              const canvas = document.querySelector('.matrix');
              const ctx = canvas.getContext('2d');

              canvas.width = window.innerWidth;
              canvas.height = window.innerHeight;

              const chars = "01";
              const fontSize = 14;
              const columns = canvas.width / fontSize;
              const drops = Array(Math.floor(columns)).fill(1);

              function draw() {
                ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = "#0f0";
                ctx.font = fontSize + "px monospace";

                for (let i = 0; i < drops.length; i++) {
                  const text = chars[Math.floor(Math.random() * chars.length)];
                  ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                  if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                  }
                  drops[i]++;
                }
              }

              setInterval(draw, 33);
            </script>
          </body>
        </html>
      `);
    }

    next();
  });
});


// ✅ Projects table setup
connection.query(`
  CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country VARCHAR(100),
    project_title VARCHAR(255),
    transaction_date DATE
  )
`, (err) => {
  if (err) return console.error("❌ Failed to create 'projects' table:", err);

  connection.query('SELECT COUNT(*) AS count FROM projects', (err, results) => {
    if (err) return console.error("❌ Failed to check 'projects' table:", err);

    if (results[0].count === 0) {
      connection.query(`
        INSERT INTO projects (country, project_title, transaction_date) VALUES
        ('Germany', 'AI Research Initiative', '2025-05-01'),
        ('India', 'Smart Farming Tech', '2025-05-05'),
        ('USA', 'Cybersecurity Program', '2025-05-07')
      `, (err) => {
        if (err) console.error("❌ Failed to insert sample data:", err);
        else console.log("✅ Sample project data inserted.");
      });
    } else {
      console.log("ℹ️ 'projects' table already has data. Skipping insert.");
    }
  });
});

// 🔍 Suspicious input checker
function isSuspicious(input) {
  const patterns = [/('|--|#|\/\*|\*\/|;|=|\bOR\b|\bAND\b)/i];
  return patterns.some(pattern => pattern.test(input));
}

// 📒 Attack logger
function logAttack(ip, username, password) {
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString().padStart(2, '0')}-${now.getDate()
    .toString().padStart(2, '0')} ${now.getHours()}:${now.getMinutes()
    .toString().padStart(2, '0')}`;

  const attackType = detectAttackType(username + " " + password);
  const logLine = `[${timestamp}] IP: ${ip}, Username: "${username}", Password: "${password}", AttackType: ${attackType}\n`;

  fs.appendFile(path.join(__dirname, 'logs', 'attack.log'), logLine, err => {
    if (err) console.error("⚠️ Failed to log attack:", err);
  });
}

// 🔓 Vulnerable login
app.post('/vuln-login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  // if (isSuspicious(username) || isSuspicious(password)) {
  //   logAttack(req.ip, username, password);
  // }

  connection.query(query, (err, results) => {
    if (err) return res.send('❌ DB error');
    //   if (err) {
    //   return res.send('Error: ' + err.sqlMessage);  // Revealing detailed error message
    // }

    if (results.length > 0) return res.redirect('/admin/admin.html');
   // else res.sendFile(path.join(__dirname, 'views', 'login-failed.html'));
  });
});

// 🔐 Secure login
app.post('/secure-login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

  if (isSuspicious(username) || isSuspicious(password)) {
    logAttack(req.ip, username, password);
  }

  connection.query(query, [username, password], (err, results) => {
    if (err) return res.send('❌ DB error');

    if (results.length > 0) {
      if (username === 'admin') return res.redirect('/admin/admin.html');
      res.send("✅ Logged in (secure)");
    } else {
      res.sendFile(path.join(__dirname, 'views', 'login-failed.html'));
    }
  });
});

// 📄 View log list
app.get('/view-logs', (req, res) => {
  const logPath = path.join(__dirname, 'logs', 'attack.log');

  fs.readFile(logPath, 'utf8', (err, data) => {
    if (err) return res.send('<h2>Error reading logs</h2>');

    const lines = data.split('\n').filter(line => line.trim() !== '');
    const logList = lines.map((line, i) => `<li><a href="/log-detail/${i}">${line}</a></li>`).join('');

    res.send(`
      <html>
        <head><title>Logs</title></head>
        <body style="background:black;color:#0f0;font-family:monospace;">
          <h1>🛑 Suspicious Login Attempts</h1>
          <ul>${logList || '<li>No logs yet.</li>'}</ul>
        </body>
      </html>
    `);
  });
});

// 📄 Log detail with block/unblock
app.get('/log-detail/:id', (req, res) => {
  const logPath = path.join(__dirname, 'logs', 'attack.log');

  fs.readFile(logPath, 'utf8', (err, data) => {
    if (err) return res.send('<h2>Error reading logs</h2>');

    const lines = data.split('\n').filter(line => line.trim() !== '');
    const logLine = lines[parseInt(req.params.id)];
    if (!logLine) return res.send('<h2>Log entry not found</h2>');

    const ipMatch = logLine.match(/IP: ([\d.:a-fA-F]+)/);
    const ipAddress = ipMatch ? ipMatch[1] : null;

    let buttonsHTML = '';
    if (ipAddress) {
      buttonsHTML = `
        <form method="POST" action="/block-ip" style="display:inline;">
          <input type="hidden" name="ip" value="${ipAddress}" />
          <button type="submit">🚫 Block IP</button>
        </form>
        <form method="POST" action="/unblock-ip" style="display:inline;margin-left:10px;">
          <input type="hidden" name="ip" value="${ipAddress}" />
          <button type="submit">✅ Unblock IP</button>
        </form>
      `;
    }

    res.send(`
      <html>
        <head><title>Log Detail</title></head>
        <body style="background:black;color:#0f0;font-family:monospace;">
          <h1>🔍 Attack Detail</h1>
          <pre>${logLine}</pre>
          ${buttonsHTML}
          <br><br><a href="/view-logs">← Back to logs</a>
        </body>
      </html>
    `);
  });
});

// ✅ Block IP
app.post('/block-ip', (req, res) => {
  const ip = req.body.ip;
  connection.query('INSERT IGNORE INTO blocked_ips (ip_address) VALUES (?)', [ip], (err) => {
    if (err) return res.send('Error blocking IP');
    res.redirect('/view-logs');
  });
});

// ✅ Unblock IP
app.post('/unblock-ip', (req, res) => {
  const ip = req.body.ip;
  connection.query('DELETE FROM blocked_ips WHERE ip_address = ?', [ip], (err) => {
    if (err) return res.send('Error unblocking IP');
    res.redirect('/view-logs');
  });
});

// 🚀 Start server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
