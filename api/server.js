// api/server.js
const jsonServer = require('json-server');

// Load db.json as in-memory object (Vercel can't read files at runtime)
let db = {
  members: [],
  supporters: []
};

try {
  // Attempt to load db.json if available (for local dev)
  const fs = require('fs');
  const path = require('path');
  const dbPath = path.join(__dirname, '../db.json');
  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath, 'utf-8');
    db = JSON.parse(data);
  } else {
    console.log('db.json not found; using default in-memory data');
  }
} catch (loadError) {
  console.error('Error loading db.json:', loadError);
  // Use default empty db
}

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults({ readOnly: false });

// CORS for frontend
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://phoenixflow.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).send();
    return;
  }
  next();
});

server.use(middlewares);
server.use(jsonServer.rewriter({
  '/api/*': '/$1',
  '/blog/:resource/:id/show': '/:resource/:id'
}));
server.use(router);

// Log requests for debugging
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Status: ${res.statusCode}`);
  next();
});

module.exports = server;