# API Integration Requirements

## Verified UI Page To API Mapping

Verified against the current frontend code and a passing browser click-through on 2026-04-13.

| Module | UI Page | Current API Dependency | Verification | Notes |
|--------|---------|------------------------|--------------|-------|
| Auth | Login | Auth API | Verified | `authAPI.login` powers the login form. |
| Admin | Dashboard | Admin Dashboard API | Verified | Uses `dashboardAPI.getAdminDashboard`, not the standalone stats endpoint. |
| Admin | Courses | Course CRUD API | Verified | Uses course list, create, update, and delete calls. |
| Admin | Batch Management | Batch + Course + Trainer API | Verified | Loads batches plus course and trainer lookups for create flow. |
| Admin | Batch Detail | Batch + Candidate + Attendance + Assessment API | Verified | Candidate list is batch-scoped; attendance and assessments are also loaded on the page. |
| Admin | User Management | User CRUD API | Verified | Uses list, create, update, and toggle-status calls. |
| OC | Dashboard | OC Dashboard API | Verified | Uses `dashboardAPI.getOCDashboard`, not `/applicationForm/stats`. |
| Placement | Placement Tracking | Placement API | Verified | Uses placement list and create calls. |
| Placement | Placement Detail | Placement Detail API | Verified | Uses placement detail and delete calls. |
| Common | Notifications | Notification API | Verified | Uses list, create, mark-one, mark-all, and unread-count calls. |

## External Tracker Corrections

Use these values if you are updating the older module-to-API spreadsheet manually.

| Module | UI Page | Use This Dependency Label |
|--------|---------|---------------------------|
| Admin | Dashboard | Admin Dashboard API |
| Admin | Batch Management | Batch + Course + Trainer API |
| Admin | Batch Detail | Batch + Candidate + Attendance + Assessment API |
| OC | Dashboard | OC Dashboard API |

## Current Exceptions And Gaps

- The standalone admin stats endpoint (`/api/v1/dashboard/admin-stats`) remains in the backend, but the current dashboard UI uses the richer `/api/v1/admin/dashboard` payload instead.
- `/applicationForm/stats` exists in the backend, but the OC dashboard currently uses `/api/v1/office-coordinator/dashboard` instead.
- The Batch Detail page depends on attendance and assessment APIs in addition to batch and candidate APIs, so a two-API dependency note is incomplete for the current implementation.

To connect the mockup frontend to a real authentication API and database-backed admin validation, these details are still required:

## Authentication API
- Base URL for the API.
- Login endpoint path.
- HTTP method for login.
- Required request payload fields.
- Required headers, including whether an API key or CSRF token is needed.
- Exact success response shape.
- Exact error response shape.
- Token type and where to store it.
- Refresh-token flow, if any.

## User and Role Validation
- Canonical role values returned by the backend.
- Whether Admin is identified by `role = admin` or by permissions.
- Exact permission keys for:
  - configure courses
  - create batches
  - manage users
  - access full reports
- Whether all four permissions are mandatory for login to the admin UI.

## Session and Security
- Token expiry duration.
- Logout endpoint, if required.
- Password policy returned or enforced by backend.
- Lockout rule after failed attempts.
- Forgot-password/reset-password endpoint details.

## Environment Details
- Development API URL.
- Staging API URL.
- Production API URL.
- CORS policy for the frontend origin.

## Database Details
- Direct DB access is not needed by this frontend.
- The frontend should only talk to the backend API.
- If validation depends on DB fields, those fields must be exposed by the API response.

## Current Frontend Assumption
- The frontend expects the backend to return user profile, role, permissions, and an auth token after successful login.
