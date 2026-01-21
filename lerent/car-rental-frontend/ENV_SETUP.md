# Environment Configuration Guide

## Overview

This application uses environment variables to configure the backend API connection and tenant information. This allows for easy switching between different environments (development, staging, production) and tenants.

## Environment Variables

The application uses the following environment variables:

### `VITE_API_BASE_URL`
- **Description**: The base URL for the backend API (without the `/api` suffix)
- **Development**: Leave **EMPTY** to use Vite proxy (avoids CORS issues)
- **Production**: Set to full URL (e.g., `https://carflow-reservation-system.onrender.com`)
- **Default**: Empty string (uses proxy)
- **Example Production**: `https://carflow-reservation-system.onrender.com`

### `VITE_TENANT_EMAIL`
- **Description**: The email address that identifies your tenant in the multi-tenant system
- **Default**: `lerent@lerent.sk`
- **Example**: `lerent@lerent.sk`

### `VITE_USE_MOCK_DATA`
- **Description**: Controls whether to use mock data or connect to the real backend
- **Values**: `true` or `false`
- **Default**: `false`
- **When to use**:
  - `true` - Use mock data for offline development or testing
  - `false` - Connect to real backend API

## Setup Instructions

### 1. Create `.env` File

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

### 2. Configure Your Environment

Edit the `.env` file with your specific configuration:

**For Local Development (recommended):**
```env
VITE_API_BASE_URL=
VITE_TENANT_EMAIL=lerent@lerent.sk
VITE_USE_MOCK_DATA=false
```

**For Production Build:**
```env
VITE_API_BASE_URL=https://carflow-reservation-system.onrender.com
VITE_TENANT_EMAIL=lerent@lerent.sk
VITE_USE_MOCK_DATA=false
```

### 3. Restart Dev Server

After changing environment variables, restart the development server:

```bash
npm run dev
```

Vite will automatically detect `.env` file changes and restart the server.

## Verification

When the application starts, you should see console logs indicating the configuration:

**Development (with proxy):**
```
🚀 API Configuration:
  Base URL: /api
  Tenant: lerent@lerent.sk
  Using Mock Data: false
```

**Production (direct connection):**
```
🚀 API Configuration:
  Base URL: https://carflow-reservation-system.onrender.com/api
  Tenant: lerent@lerent.sk
  Using Mock Data: false
```

Open your browser console at http://localhost:3006/ to verify the configuration.

## Different Configurations

### Development with Real Backend

```env
VITE_API_BASE_URL=https://carflow-reservation-system.onrender.com
VITE_TENANT_EMAIL=lerent@lerent.sk
VITE_USE_MOCK_DATA=false
```

### Development with Mock Data (Offline)

```env
VITE_API_BASE_URL=https://carflow-reservation-system.onrender.com
VITE_TENANT_EMAIL=lerent@lerent.sk
VITE_USE_MOCK_DATA=true
```

### Different Tenant

```env
VITE_API_BASE_URL=https://carflow-reservation-system.onrender.com
VITE_TENANT_EMAIL=another-tenant@example.com
VITE_USE_MOCK_DATA=false
```

### Local Backend (Development)

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_TENANT_EMAIL=lerent@lerent.sk
VITE_USE_MOCK_DATA=false
```

## Production Build

For production builds, set environment variables in your deployment platform:

### Render.com

1. Go to your Render.com dashboard
2. Select your web service
3. Navigate to "Environment" section
4. Add the following environment variables:
   - `VITE_API_BASE_URL` = `https://carflow-reservation-system.onrender.com`
   - `VITE_TENANT_EMAIL` = `lerent@lerent.sk`
   - `VITE_USE_MOCK_DATA` = `false`

### Vercel

```bash
vercel env add VITE_API_BASE_URL
vercel env add VITE_TENANT_EMAIL
vercel env add VITE_USE_MOCK_DATA
```

### Netlify

Add to `netlify.toml`:

```toml
[build.environment]
  VITE_API_BASE_URL = "https://carflow-reservation-system.onrender.com"
  VITE_TENANT_EMAIL = "lerent@lerent.sk"
  VITE_USE_MOCK_DATA = "false"
```

## Security Notes

- ⚠️ **Never commit `.env` to version control** - It's already in `.gitignore`
- ✅ Always use `.env.example` as a template
- ✅ Environment variables prefixed with `VITE_` are exposed to the frontend code
- ⚠️ Do not store sensitive secrets in frontend environment variables
- ✅ Backend API handles authentication and authorization

## Troubleshooting

### CORS Errors (Access-Control-Allow-Origin)

**Symptom:** Console shows `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution for Development:**
1. Set `VITE_API_BASE_URL=` (empty) in `.env`
2. This uses Vite proxy to avoid CORS issues
3. Restart dev server: `npm run dev`
4. Verify logs show: `Base URL: /api`

**Solution for Production:**
1. Backend must enable CORS for your frontend domain
2. Contact backend admin to whitelist your domain
3. Or deploy frontend and backend on same domain

### Configuration Not Loading

1. Make sure environment variables are prefixed with `VITE_`
2. Restart the development server after changing `.env`
3. Clear browser cache and reload
4. Check for typos in variable names

### Still Using Mock Data

1. Check console logs for "Using Mock Data: true"
2. Verify `VITE_USE_MOCK_DATA=false` in `.env`
3. Restart dev server
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### API Requests Failing (Non-CORS)

1. Check console logs for API Base URL
2. Verify backend is running at the configured URL
3. Check network tab for error status codes
4. Verify tenant email exists in backend
5. Check if backend service is sleeping (Render free tier)

### Proxy Not Working

**Symptom:** Still seeing direct requests to carflow-reservation-system.onrender.com

1. Ensure `VITE_API_BASE_URL` is empty in `.env`
2. Check vite.config.js has proxy configuration
3. Restart dev server completely
4. Clear browser cache

## API Endpoints

With the configured tenant, the application will call:

- **Get Cars**: `GET /api/public/users/lerent@lerent.sk/cars`
- **Get Car Details**: `GET /api/public/users/lerent@lerent.sk/cars/:id`
- **Check Availability**: `GET /api/public/users/lerent@lerent.sk/cars/:id/availability`
- **Create Reservation**: `POST /api/public/users/lerent@lerent.sk/reservations`

## Need Help?

- Check browser console for configuration logs
- Verify `.env` file exists and contains correct values
- Ensure backend API is running and accessible
- Check network tab for API requests
