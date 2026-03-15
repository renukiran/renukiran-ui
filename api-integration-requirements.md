# API Integration Requirements

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
