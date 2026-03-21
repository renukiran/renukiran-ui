// API Service with JWT token handling
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiCall = async (endpoint, method = 'GET', data = null) => {
  try {
    const options = {
      method,
      headers: getAuthHeaders(),
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Application endpoints
export const applicationAPI = {
  submitApplication: (formData) => apiCall('/applications', 'POST', formData),
  getApplications: () => apiCall('/applications', 'GET'),
  getApplicationById: (id) => apiCall(`/applications/${id}`, 'GET'),
  updateApplication: (id, formData) => apiCall(`/applications/${id}`, 'PUT', formData),
};

// Batch endpoints
export const batchAPI = {
  getBatches: () => apiCall('/batches', 'GET'),
  getBatchById: (id) => apiCall(`/batches/${id}`, 'GET'),
};

// Placement endpoints
export const placementAPI = {
  getPlacements: () => apiCall('/placements', 'GET'),
  getPlacementById: (id) => apiCall(`/placements/${id}`, 'GET'),
};

// Notification endpoints
export const notificationAPI = {
  getNotifications: () => apiCall('/notifications', 'GET'),
  markAsRead: (id) => apiCall(`/notifications/${id}/read`, 'PATCH'),
};

// Dashboard endpoints
export const dashboardAPI = {
  getStats: () => apiCall('/dashboard/stats', 'GET'),
  getAdminStats: () => apiCall('/dashboard/admin-stats', 'GET'),
};

// Auth endpoints
export const authAPI = {
  login: (credentials) => apiCall('/auth/login', 'POST', credentials),
  logout: () => apiCall('/auth/logout', 'POST'),
  forgotPassword: (email) => apiCall('/auth/forgot-password', 'POST', { email }),
};

// Course endpoints
export const courseAPI = {
  getCourses: () => apiCall('/courses', 'GET'),
  getCourseById: (id) => apiCall(`/courses/${id}`, 'GET'),
  createCourse: (data) => apiCall('/courses', 'POST', data),
  updateCourse: (id, data) => apiCall(`/courses/${id}`, 'PUT', data),
  deleteCourse: (id) => apiCall(`/courses/${id}`, 'DELETE'),
};

// User/staff endpoints
export const userAPI = {
  getUsers: () => apiCall('/users', 'GET'),
  getUserById: (id) => apiCall(`/users/${id}`, 'GET'),
  createUser: (data) => apiCall('/users', 'POST', data),
  updateUser: (id, data) => apiCall(`/users/${id}`, 'PUT', data),
  toggleUserStatus: (id) => apiCall(`/users/${id}/toggle-status`, 'PATCH'),
};
