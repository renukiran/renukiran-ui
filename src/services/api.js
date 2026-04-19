// API Service with JWT token handling
// Proxy is disabled — using REACT_APP_API_URL directly for all API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://renukiran-services.onrender.com';

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
      let errorMsg = `HTTP error! status: ${response.status}`;
      try {
        const errBody = await response.json();
        const detail =
          (Array.isArray(errBody?.details) && errBody.details.length > 0
            ? errBody.details.join('; ')
            : null) ||
          errBody?.message ||
          errBody?.error ||
          (typeof errBody === 'string' ? errBody : null);
        if (detail) errorMsg = detail;
      } catch {}
      const err = new Error(errorMsg);
      err.status = response.status;
      throw err;
    }

    // 204 No Content — return null without trying to parse JSON
    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Auth endpoints — backend: POST /auth/admin
export const authAPI = {
  login: (credentials) => apiCall('/auth/admin', 'POST', credentials),
  logout: () => Promise.resolve(),
  forgotPassword: (email) => apiCall('/auth/forgot-password', 'POST', { email }),
};

// Course endpoints — backend: /courses
export const courseAPI = {
  getCourses: () => apiCall('/courses', 'GET'),
  getCourseById: (id) => apiCall(`/courses/${id}`, 'GET'),
  createCourse: (data) => apiCall('/courses', 'POST', data),
  updateCourse: (id, data) => apiCall(`/courses/${id}`, 'PUT', data),
  deleteCourse: (id) => apiCall(`/courses/${id}`, 'DELETE'),
};

// Batch endpoints — backend: /api/v1/batches
export const batchAPI = {
  getBatches: () => apiCall('/api/v1/batches', 'GET'),
  getBatchById: (id) => apiCall(`/api/v1/batches/${id}`, 'GET'),
  createBatch: (data) => apiCall('/api/v1/batches', 'POST', data),
  updateBatch: (id, data) => apiCall(`/api/v1/batches/${id}`, 'PUT', data),
  deleteBatch: (id) => apiCall(`/api/v1/batches/${id}`, 'DELETE'),
};

// Candidate endpoints — backend: /api/v1/candidates
export const candidateAPI = {
  getCandidates: () => apiCall('/api/v1/candidates', 'GET'),
  getCandidateById: (id) => apiCall(`/api/v1/candidates/${id}`, 'GET'),
  getCandidatesByBatchId: (batchId) => apiCall(`/api/v1/batches/${batchId}/candidates`, 'GET'),
};

// User/staff endpoints — backend: /api/v1/users
export const userAPI = {
  getUsers: () => apiCall('/api/v1/users', 'GET'),
  getUserById: (id) => apiCall(`/api/v1/users/${id}`, 'GET'),
  createUser: (data) => apiCall('/api/v1/users', 'POST', data),
  updateUser: (id, data) => apiCall(`/api/v1/users/${id}`, 'PUT', data),
  deleteUser: (id) => apiCall(`/api/v1/users/${id}`, 'DELETE'),
  toggleUserStatus: (id) => apiCall(`/api/v1/users/${id}/toggle-status`, 'PATCH'),
};

// Placement endpoints — backend: /api/v1/placements
export const placementAPI = {
  getPlacements: () => apiCall('/api/v1/placements', 'GET'),
  getPlacementById: (id) => apiCall(`/api/v1/placements/${id}`, 'GET'),
  createPlacement: (data) => apiCall('/api/v1/placements', 'POST', data),
  updatePlacement: (id, data) => apiCall(`/api/v1/placements/${id}`, 'PUT', data),
  deletePlacement: (id) => apiCall(`/api/v1/placements/${id}`, 'DELETE'),
};

// Notification endpoints — backend: /api/v1/notifications
export const notificationAPI = {
  getNotifications: () => apiCall('/api/v1/notifications', 'GET'),
  getUnreadCount: () => apiCall('/api/v1/notifications/unread-count', 'GET'),
  createNotification: (message) => apiCall('/api/v1/notifications', 'POST', { message }),
  markAsRead: (id) => apiCall(`/api/v1/notifications/${id}/read`, 'PATCH'),
  markAllAsRead: () => apiCall('/api/v1/notifications/read-all', 'PATCH'),
};

// Trainer endpoints — backend: /api/v1/trainers
export const trainerAPI = {
  getTrainers: () => apiCall('/api/v1/trainers', 'GET'),
  getDashboard: (trainerId) => apiCall(`/api/v1/trainers/${trainerId}/dashboard`, 'GET'),
};

// Attendance endpoints — backend: /api/v1/batches/{batchId}/attendance
export const attendanceAPI = {
  getAttendancePage: (batchId, attendanceDate) => {
    const query = attendanceDate ? `?attendanceDate=${encodeURIComponent(attendanceDate)}` : '';
    return apiCall(`/api/v1/batches/${batchId}/attendance${query}`, 'GET');
  },
  saveAttendance: (batchId, data) => apiCall(`/api/v1/batches/${batchId}/attendance`, 'POST', data),
};

// Assessment endpoints — backend: /api/v1/batches/{batchId}/assessments
export const assessmentAPI = {
  getAssessmentEntryPage: (batchId) => apiCall(`/api/v1/batches/${batchId}/assessments`, 'GET'),
  getAssessmentResultsPage: (batchId) => apiCall(`/api/v1/batches/${batchId}/assessments/results`, 'GET'),
  saveAssessments: (batchId, data) => apiCall(`/api/v1/batches/${batchId}/assessments`, 'POST', data),
  publishAssessments: (batchId) => apiCall(`/api/v1/batches/${batchId}/assessments/publish`, 'POST'),
};

// Dashboard endpoints — backend: /api/v1/dashboard
export const dashboardAPI = {
  getAdminStats: () => apiCall('/api/v1/dashboard/admin-stats', 'GET'),
};

// Application form endpoints — backend: /applicationForm
export const applicationAPI = {
  submitApplication: (formData) => apiCall('/applicationForm', 'POST', formData),
  getApplications: () => apiCall('/applicationForm', 'GET'),
  getApplicationById: (id) => apiCall(`/applicationForm/${id}`, 'GET'),
  updateApplication: (id, formData) => apiCall(`/applicationForm/${id}`, 'PUT', formData),
};

// Admissions endpoints — backend: /api/v1/admissions
export const admissionsAPI = {
  assignToBatch: (candidateId, batchId) => apiCall('/api/v1/admissions', 'POST', { candidateId, batchId }),
};

