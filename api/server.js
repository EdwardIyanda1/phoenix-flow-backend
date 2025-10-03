const jsonServer = require('json-server');
const db = { members: [], supporters: [] };
try {
  const server = jsonServer.create();
  const router = jsonServer.router(db);
  const middlewares = jsonServer.defaults({ readOnly: false });
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://phoenixflow.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') return res.status(200).send();
    next();
  });
  server.use(middlewares);
  server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
  }));
  server.use(router);
  server.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Status: ${res.statusCode}`);
    next();
  });
  module.exports = server;
} catch (error) {
  console.error('Server initialization error:', error);
  throw new Error(`Failed to initialize json-server: ${error.message}`);
}