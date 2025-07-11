# 🚀 Quick Start Deployment Guide

Get your AI Resume Builder deployed to Google Cloud in under 30 minutes!

## ⚡ Prerequisites (5 minutes)

1. **Google Cloud Account** with billing enabled
2. **Google Cloud CLI** installed: [Install Guide](https://cloud.google.com/sdk/docs/install)
3. **Docker** installed: [Install Guide](https://docs.docker.com/get-docker/)
4. **MongoDB Atlas** account: [Sign up](https://www.mongodb.com/atlas)
5. **Gemini API Key**: [Get from Google AI Studio](https://aistudio.google.com/)

## 🎯 Step 1: Initial Setup (5 minutes)

```bash
# 1. Login to Google Cloud
gcloud auth login

# 2. Create project (replace with your preferred project ID)
gcloud projects create ai-resume-builder-prod --name="AI Resume Builder"

# 3. Set as default project
gcloud config set project ai-resume-builder-prod

# 4. Enable billing (do this in console)
# Visit: https://console.cloud.google.com/billing

# 5. Run automated setup
./deployment-scripts/setup-gcp.sh
```

## 🗄️ Step 2: Database Setup (5 minutes)

### MongoDB Atlas Quick Setup

1. **Create Cluster**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create new cluster (free tier is fine)
   - Choose Google Cloud Platform, region: `us-central1`

2. **Create Database User**:
   - Username: `ai-resume-builder-user`
   - Generate secure password (save it!)

3. **Network Access**:
   - Add IP: `0.0.0.0/0` (for Cloud Run access)

4. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` and set database name to `ai_resume_builder`

## 🔑 Step 3: API Keys Setup (2 minutes)

### Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API key"
3. Create API key in your project
4. Copy and save the key securely

## 🚀 Step 4: Deploy Backend (5 minutes)

```bash
# 1. Deploy backend to Cloud Run
./deployment-scripts/deploy-backend.sh

# 2. Set environment variables
./deployment-scripts/set-env-vars.sh
```

When prompted, enter:
- **MongoDB URI**: Your Atlas connection string
- **JWT Secret**: Generate a strong random string (32+ characters)
- **Gemini API Key**: Your API key from Step 3
- **Allowed Site**: Will be set after frontend deployment

## 🌐 Step 5: Deploy Frontend (5 minutes)

```bash
# Deploy frontend to Cloud Storage
./deployment-scripts/deploy-frontend.sh
```

When prompted, enter your backend URL (from Step 4 output).

## 🔧 Step 6: Final Configuration (3 minutes)

```bash
# Update backend CORS with frontend URL
gcloud run services update ai-resume-builder-backend \
    --region=us-central1 \
    --set-env-vars ALLOWED_SITE=https://storage.googleapis.com/ai-resume-builder-frontend-ai-resume-builder-prod/index.html
```

## ✅ Step 7: Verify Deployment

### Test Your Application

1. **Frontend URL**: 
   ```
   https://storage.googleapis.com/ai-resume-builder-frontend-ai-resume-builder-prod/index.html
   ```

2. **Backend URL**: 
   ```bash
   gcloud run services describe ai-resume-builder-backend --region=us-central1 --format='value(status.url)'
   ```

3. **Health Check**:
   ```bash
   curl https://your-backend-url.run.app/health
   ```

### Test User Flow

1. Open your frontend URL
2. Register a new account
3. Create a resume
4. Test AI enhancement features
5. Download/share resume

## 🔄 Automated Deployments

Your deployment includes automated CI/CD! Every push to the `main` branch will:

1. **Automatically build and deploy backend** to Cloud Run
2. **Automatically build and deploy frontend** to Cloud Storage
3. **Send notifications** on build success/failure

## 📊 Monitoring & Logs

### View Application Logs
```bash
# Backend logs
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=ai-resume-builder-backend" --limit=50

# Build logs
gcloud builds list --limit=10
```

### Monitor Performance
- **Cloud Console**: [console.cloud.google.com](https://console.cloud.google.com)
- **Cloud Run**: Navigate to Cloud Run → ai-resume-builder-backend
- **Cloud Storage**: Navigate to Cloud Storage → your frontend bucket

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Cloud Build logs in console
   - Verify all environment variables are set
   - Ensure billing is enabled

2. **CORS Errors**
   - Verify ALLOWED_SITE environment variable
   - Check frontend and backend URLs match

3. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check network access settings (0.0.0.0/0)
   - Ensure database user has proper permissions

4. **API Errors**
   - Verify Gemini API key is correct
   - Check API quotas in Google Cloud Console
   - Ensure Generative Language API is enabled

### Quick Fixes

```bash
# Restart backend service
gcloud run services update ai-resume-builder-backend --region=us-central1

# Check environment variables
gcloud run services describe ai-resume-builder-backend --region=us-central1 --format='value(spec.template.spec.template.spec.containers[0].env[].name,spec.template.spec.template.spec.containers[0].env[].value)'

# Redeploy frontend
./deployment-scripts/deploy-frontend.sh

# View recent errors
gcloud logs read "resource.type=cloud_run_revision AND severity=ERROR" --limit=20
```

## 💰 Cost Estimation

### Expected Monthly Costs (Low Traffic)

- **Cloud Run**: $0-10 (scales to zero)
- **Cloud Storage**: $1-5 (static files)
- **Cloud Build**: Free (120 build-minutes/day)
- **MongoDB Atlas**: Free (M0 tier)
- **Gemini API**: $5-20 (depending on usage)

**Total**: ~$6-35/month for small to medium usage

## 🎉 Success!

Your AI Resume Builder is now live in production! 

### Your URLs:
- **Frontend**: `https://storage.googleapis.com/ai-resume-builder-frontend-ai-resume-builder-prod/index.html`
- **Backend**: Check with `gcloud run services describe ai-resume-builder-backend --region=us-central1 --format='value(status.url)'`

### Next Steps:
1. **Custom Domain**: Set up a custom domain for better branding
2. **SSL Certificate**: Configure HTTPS with your domain
3. **Monitoring**: Set up alerts and monitoring dashboards
4. **Backup**: Configure automated database backups
5. **Scaling**: Monitor usage and adjust scaling settings

## 📞 Need Help?

- **Documentation**: Check the `docs/` folder for detailed guides
- **Logs**: Use Cloud Console for detailed debugging
- **Support**: Google Cloud Support for infrastructure issues
- **Community**: Stack Overflow for development questions

## 🔄 Updates & Maintenance

### Regular Tasks:
- **Weekly**: Check logs and performance metrics
- **Monthly**: Update dependencies and rotate API keys
- **Quarterly**: Review costs and optimize resources

### Updating Your App:
1. Make changes to your code
2. Push to `main` branch
3. Automated deployment handles the rest!

---

**Congratulations! Your AI Resume Builder is now production-ready on Google Cloud! 🎉**
