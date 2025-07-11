# Google App Engine Deployment Guide

This guide explains how to deploy your AI Resume Builder as a monolithic application to Google App Engine Standard.

## Prerequisites

1. **Google Cloud SDK**: Install and configure gcloud CLI
   ```bash
   # Install Google Cloud SDK
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   
   # Initialize and authenticate
   gcloud init
   gcloud auth login
   ```

2. **Google Cloud Project**: Create or select a project
   ```bash
   # Create a new project (optional)
   gcloud projects create your-project-id
   
   # Set the project
   gcloud config set project your-project-id
   
   # Enable App Engine API
   gcloud services enable appengine.googleapis.com
   
   # Initialize App Engine (choose region when prompted)
   gcloud app create
   ```

## Environment Variables Setup

Before deploying, you need to set up your environment variables in `app.yaml`:

1. Open `Backend/app.yaml`
2. Update the `env_variables` section with your actual values:
   ```yaml
   env_variables:
     NODE_ENV: production
     PORT: 8080
     MONGODB_URI: "your-mongodb-connection-string"
     JWT_SECRET: "your-jwt-secret"
     GEMINI_API_KEY: "your-gemini-api-key"
     ALLOWED_SITE: "https://your-project-id.appspot.com"
   ```

## Deployment Steps

### 1. Build and Deploy

From the Backend directory, run:

```bash
# Navigate to backend directory
cd Backend

# Install dependencies (if not already done)
npm install

# Build the frontend and prepare for deployment
npm run build

# Deploy to App Engine
npm run deploy
```

### 2. Alternative: Manual Steps

If you prefer to run the steps manually:

```bash
# 1. Build frontend
cd Frontend
npm install
npm run build

# 2. Copy frontend build to backend
cd ../Backend
rm -rf public
cp -r ../Frontend/dist public

# 3. Deploy to App Engine
gcloud app deploy
```

### 3. Deploy to Staging (Optional)

To deploy a staging version without affecting production:

```bash
npm run deploy:staging
```

## Verification

After deployment:

1. **Check deployment status**:
   ```bash
   gcloud app browse
   ```

2. **View logs**:
   ```bash
   gcloud app logs tail -s default
   ```

3. **Test health endpoint**:
   ```bash
   curl https://your-project-id.appspot.com/api/users/health
   ```

## Architecture

The deployed application serves:

- **API routes**: All routes under `/api/*` are handled by Express.js
- **Frontend routes**: All other routes serve the React application
- **Static files**: Built React assets are served from `/public`
- **Fallback routing**: React Router handles client-side routing

## File Structure After Build

```
Backend/
├── app.yaml                 # App Engine configuration
├── .gcloudignore           # Files to exclude from deployment
├── public/                 # Built React app (created during build)
│   ├── index.html
│   ├── assets/
│   └── ...
├── src/
│   ├── app.js             # Updated to serve both API and frontend
│   └── ...
└── package.json           # Updated with deployment scripts
```

## Troubleshooting

### Common Issues

1. **Build fails**: Ensure both Frontend and Backend dependencies are installed
2. **Environment variables**: Double-check all required env vars are set in app.yaml
3. **MongoDB connection**: Ensure your MongoDB instance allows connections from App Engine
4. **CORS issues**: CORS is disabled in production mode for the monolithic setup

### Useful Commands

```bash
# View app versions
gcloud app versions list

# Delete old versions
gcloud app versions delete VERSION_ID

# View app details
gcloud app describe

# Set traffic allocation
gcloud app services set-traffic default --splits=VERSION_ID=1
```

## Cost Optimization

- The app uses automatic scaling with min_instances: 0 to reduce costs
- Unused versions should be deleted to avoid storage costs
- Monitor usage in Google Cloud Console

## Security Notes

- Never commit sensitive environment variables to version control
- Use Google Secret Manager for production secrets (optional enhancement)
- Regularly rotate JWT secrets and API keys
