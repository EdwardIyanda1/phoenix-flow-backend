// api/server.js - Updated for Vercel Serverless
const jsonServer = require('json-server');

try {
  const server = jsonServer.create();
  const router = jsonServer.router('db.json');
  const middlewares = jsonServer.defaults();

  server.use(middlewares);
  server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
  }));
  server.use(router);

  // Export for Vercel (no .listen() needed in serverless)
  module.exports = server;
} catch (error) {
  console.error('Server initialization error:', error);
  // For Vercel, throw to surface the error in logs
  throw new Error(`Failed to initialize json-server: ${error.message}`);
}