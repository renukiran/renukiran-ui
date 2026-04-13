# renukiran-ui

## Local Run

The UI runs on `http://localhost:3000` and proxies API requests to the backend on `http://localhost:8080` by default.

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm ci
```

### Start

```bash
npm start
```

### Optional backend override

If the backend is not running on `http://localhost:8080`, set `REACT_APP_API_URL` before starting the dev server.

PowerShell:

```powershell
$env:REACT_APP_API_URL='http://localhost:8081'
npm start
```
