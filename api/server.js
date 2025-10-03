// api/server.js
const jsonServer = require('json-server');

try {
  const server = jsonServer.create();
  const router = jsonServer.router('db.json');
  const middlewares = jsonServer.defaults({ readOnly: false });

  // Explicit CORS configuration
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://phoenixflow.vercel.app'); // Specific origin
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  server.use(middlewares);
  server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
  }));
  server.use(router);

  module.exports = server;
} catch (error) {
  console.error('Server initialization error:', error);
  throw new Error(`Failed to initialize json-server: ${error.message}`);
}