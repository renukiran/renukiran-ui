window.RWF_AUTH_CONFIG = {
  apiBaseUrl: 'http://localhost:3000',
  loginEndpoint: '/api/auth/login',
  forgotPasswordUrl: '#',
  tokenStorageKey: 'rwf-auth-token',
  sessionStorageKey: 'rwf-auth-session',
  rememberMeKey: 'rwf-remember-email',
  requestHeaders: {
    'Content-Type': 'application/json'
  },
  requiredAdminPermissions: [
    'configure_courses',
    'create_batches',
    'manage_users',
    'access_full_reports'
  ],
  roleRedirects: {
    admin: '02-admin-dashboard.html',
    office_coordinator: '08-oc-dashboard.html',
    trainer: '21-trainer-dashboard.html'
  },
  enableMockFallback: true,
  mockUsers: [
    {
      email: 'admin@renukiran.org',
      password: 'Admin@123',
      token: 'mock-admin-token',
      user: {
        id: 'admin-1',
        name: 'Vijay Anand',
        email: 'admin@renukiran.org',
        role: 'admin',
        permissions: [
          'configure_courses',
          'create_batches',
          'manage_users',
          'access_full_reports'
        ]
      }
    }
  ]
};
