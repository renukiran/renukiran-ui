const { createProxyMiddleware } = require('http-proxy-middleware');

// Proxies all API requests through the CRA dev server to avoid browser CORS errors.
// Reads REACT_APP_API_URL from .env file
const target = process.env.REACT_APP_API_URL || 'https://renukiran-services.onrender.com';

console.log('========================================');
console.log('🔧 Proxy Configuration');
console.log('Target URL:', target);
console.log('Proxying routes: /auth, /api, /courses, /applicationForm, /h2-console');
console.log('========================================');

module.exports = function (app) {
  app.use(
    ['/auth', '/api', '/courses', '/applicationForm', '/h2-console','/batches'],
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log(`[PROXY] ${req.method} ${req.path} -> ${target}${req.path}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`[PROXY] Response ${proxyRes.statusCode} for ${req.path}`);
      },
      onError: (err, req, res) => {
        console.error(`[PROXY ERROR] ${req.path}:`, err.message);
      },
    })
  );
};
