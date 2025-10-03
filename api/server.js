const jsonServer = require('json-server');
const { createClient } = require('@vercel/kv');

try {
  const server = jsonServer.create();
  const kv = createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });

  let db = { members: [], supporters: [] };
  kv.get('db').then(data => {
    if (data) db = data;
  }).catch(err => console.error('KV load error:', err));

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
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      setTimeout(() => {
        kv.set('db', db).catch(err => console.error('KV save error:', err));
      }, 0);
    }
    next();
  });

  module.exports = server;
} catch (error) {
  console.error('Server initialization error:', error);
  throw new Error(`Failed to initialize json-server: ${error.message}`);
}