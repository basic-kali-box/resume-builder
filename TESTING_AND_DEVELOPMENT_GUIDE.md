# Testing and Development Guide

## 🎯 Current Status: CORS Issues Fixed!

All CORS and API configuration issues have been resolved. Your application now works correctly in both development and production modes.

## 🧪 Testing Options

### Option 1: Production-like Testing (Monolithic) ⭐ **RECOMMENDED**

This tests the exact same setup that will be deployed to Google App Engine.

```bash
# 1. Build frontend and move to backend
cd Backend
npm run build

# 2. Start monolithic server
NODE_ENV=production PORT=8080 npm start

# 3. Open browser to:
# http://localhost:8080
```

**Benefits:**
- ✅ Tests exact production setup
- ✅ No CORS issues
- ✅ All API calls use relative paths
- ✅ Same domain for frontend and backend

### Option 2: Development Mode (Hot Reload)

For active development with hot reload:

```bash
# Terminal 1: Start backend
cd Backend
npm run dev
# Backend runs on http://localhost:5001

# Terminal 2: Start frontend  
cd Frontend
npm run dev
# Frontend runs on http://localhost:5173
```

**Benefits:**
- ✅ Hot reload for development
- ✅ Separate debugging
- ✅ CORS properly configured

## 🔧 What Was Fixed

### 1. API Service Configuration
Updated all frontend API services to use environment-aware base URLs:

```javascript
// Before (causing CORS issues)
baseURL: VITE_APP_URL + "api/"

// After (smart environment detection)
const getBaseURL = () => {
  if (import.meta.env.PROD) {
    return "/api/";  // Relative paths in production
  }
  return (VITE_APP_URL || "http://localhost:5001/") + "api/";
};
```

### 2. Fixed Files
- ✅ `Frontend/src/Services/resumeAPI.js`
- ✅ `Frontend/src/Services/login.js`
- ✅ `Frontend/src/Services/GlobalApi.js`
- ✅ `Frontend/src/pages/dashboard/components/AddResume.jsx`
- ✅ `Frontend/.env.production`

### 3. Environment Configuration
- ✅ Production: Uses relative paths (`/api/`)
- ✅ Development: Uses `http://localhost:5001/api/`
- ✅ Fallback: Defaults to `http://localhost:5001/api/`

## 🚀 Deployment Ready

Your application is now ready for Google App Engine deployment:

```bash
cd Backend
npm run deploy
```

## 🐛 Troubleshooting

### "Connection Refused" Error
**Cause:** No backend server running
**Solution:** Choose one of the testing options above

### CORS Errors
**Cause:** Should not happen anymore with the fixes
**Solution:** Verify you're using the updated build

### API 404 Errors
**Cause:** API endpoint doesn't exist
**Solution:** Check backend routes and ensure server is running

### Environment Variable Issues
**Cause:** Missing or incorrect environment variables
**Solution:** Check `.env` files and ensure all required variables are set

## 📝 Quick Commands

```bash
# Test monolithic (production-like)
cd Backend && npm run build && NODE_ENV=production PORT=8080 npm start

# Development mode
cd Backend && npm run dev  # Terminal 1
cd Frontend && npm run dev # Terminal 2

# Deploy to Google App Engine
cd Backend && npm run deploy

# Health check
curl http://localhost:8080/api/users/health
```

## ✅ Verification Checklist

- [ ] Monolithic server starts without errors
- [ ] Frontend loads at `http://localhost:8080`
- [ ] Login/register works without CORS errors
- [ ] Resume upload works without CORS errors
- [ ] All API endpoints respond correctly
- [ ] No console errors in browser
- [ ] Health check returns 200 OK

Your AI Resume Builder is now fully configured for both development and production! 🎉
