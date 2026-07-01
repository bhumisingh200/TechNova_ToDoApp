const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./db');

const PORT = 3001;

// Initialize Database Tables
try {
  db.execute(`
    CREATE TABLE IF NOT EXISTS todo_users (
      username VARCHAR(100) PRIMARY KEY,
      password VARCHAR(100) NOT NULL
    )
  `);
  db.execute(`
    CREATE TABLE IF NOT EXISTS todo_states (
      username VARCHAR(100) PRIMARY KEY,
      state_json LONGTEXT NOT NULL
    )
  `);
  console.log("Database initialized successfully.");
} catch (e) {
  console.error("Error initializing database tables:", e);
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function readBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    callback(body);
  });
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // 1. API: LOGIN
  if (pathname === '/api/todo/auth/login' && req.method === 'POST') {
    readBody(req, body => {
      try {
        const { username, password } = JSON.parse(body);
        if (!username || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Username and password are required' }));
          return;
        }

        const user = db.queryOne(`SELECT * FROM todo_users WHERE username = ${db.escape(username)}`);
        if (user && user.password === password) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Invalid username or password' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Server error' }));
      }
    });
    return;
  }

  // 2. API: REGISTER
  if (pathname === '/api/todo/auth/register' && req.method === 'POST') {
    readBody(req, body => {
      try {
        const { username, password } = JSON.parse(body);
        if (!username || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Username and password are required' }));
          return;
        }

        const user = db.queryOne(`SELECT * FROM todo_users WHERE username = ${db.escape(username)}`);
        if (user) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Username already exists' }));
          return;
        }

        db.execute(`INSERT INTO todo_users (username, password) VALUES (${db.escape(username)}, ${db.escape(password)})`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Server error' }));
      }
    });
    return;
  }

  // 3. API: GET STATE
  if (pathname === '/api/todo/state' && req.method === 'GET') {
    try {
      const username = url.searchParams.get('username');
      if (!username) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Username is required' }));
        return;
      }

      const row = db.queryOne(`SELECT state_json FROM todo_states WHERE username = ${db.escape(username)}`);
      if (row && row.state_json) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, state: JSON.parse(row.state_json) }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'No saved state found' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Server error' }));
    }
    return;
  }

  // 4. API: SAVE STATE
  if (pathname === '/api/todo/state' && req.method === 'POST') {
    readBody(req, body => {
      try {
        const { username, state } = JSON.parse(body);
        if (!username || !state) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Username and state are required' }));
          return;
        }

        const stateJson = JSON.stringify(state);
        db.execute(`
          INSERT INTO todo_states (username, state_json) 
          VALUES (${db.escape(username)}, ${db.escape(stateJson)})
          ON DUPLICATE KEY UPDATE state_json = ${db.escape(stateJson)}
        `);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Server error' }));
      }
    });
    return;
  }

  // 5. STATIC FILES SERVER
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(__dirname, filePath);

  // Guard against directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Access Forbidden');
    return;
  }

  fs.exists(filePath, exists => {
    if (!exists) {
      res.writeHead(404);
      res.end('File Not Found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`To-Do App Server listening on http://localhost:${PORT}`);
});
