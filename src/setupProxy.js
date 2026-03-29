const { createProxyMiddleware } = require('http-proxy-middleware');

// Proxies all API requests through the CRA dev server to avoid browser CORS errors.
// For local dev the Spring Boot server runs on port 8083.
// Set REACT_APP_API_URL to override (e.g. Railway deployment URL).
const target =
  process.env.REACT_APP_API_URL || 'http://localhost:8083';

module.exports = function (app) {
  app.use(
    ['/auth', '/api', '/courses', '/applicationForm', '/h2-console'],
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
    })
  );
};
