# Deployment Guide

## Overview

This guide covers deploying the Technician Task Management System to production using:
- **Frontend**: Vercel (free tier)
- **Backend**: Render (free tier)
- **Database**: MongoDB Atlas (free tier)
- **Auth**: Firebase (free tier)

Total cost: **$0/month** for starter deployment! 🎉

---

## Prerequisites Checklist

Before deploying, ensure you have:
- ✅ MongoDB Atlas account with cluster created
- ✅ Firebase project with authentication enabled
- ✅ GitHub account
- ✅ Vercel account (sign up with GitHub)
- ✅ Render account (sign up with GitHub)
- ✅ Code pushed to GitHub repository

---

## Step 1: Prepare Your Code

### 1.1 Create GitHub Repository

```bash
# Initialize git (if not already done)
cd /home/rama/42
git init

# Create .gitignore in root
echo "node_modules/
.env
.env.local
*.log
.DS_Store
dist/
build/" > .gitignore

# Add and commit
git add .
git commit -m "Initial commit: Technician Task Management System"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/technician-task-manager.git
git branch -M main
git push -u origin main
```

### 1.2 Verify .gitignore

Ensure these files are NOT committed:
- `.env` files (both frontend and backend)
- `node_modules/`
- Firebase service account JSON

---

## Step 2: Deploy Backend to Render

### 2.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Settings:**
```
Name: technician-task-backend
Environment: Node
Region: Choose closest to your users
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### 2.2 Set Environment Variables

Click **"Environment"** tab and add:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/technician-task-db?retryWrites=true&w=majority

PORT=5000

NODE_ENV=production

JWT_SECRET=your-production-jwt-secret-min-32-chars

FIREBASE_PROJECT_ID=your-project-id

FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour-Key\n-----END PRIVATE KEY-----\n

FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

FRONTEND_URL=https://your-app.vercel.app
```

**Important Notes:**
- Generate a new, strong JWT_SECRET (32+ characters)
- For FIREBASE_PRIVATE_KEY, keep the `\n` escape characters
- FRONTEND_URL will be updated after deploying frontend

### 2.3 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Copy your service URL: `https://technician-task-backend.onrender.com`

### 2.4 Test Deployment

```bash
curl https://your-app.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:

**Project Settings:**
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.2 Set Environment Variables

Click **"Environment Variables"** and add:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

VITE_API_URL=https://technician-task-backend.onrender.com/api
```

**Important:**
- Use your Render backend URL for `VITE_API_URL`
- Include `/api` at the end

### 3.3 Deploy

1. Click **"Deploy"**
2. Wait for build (2-3 minutes)
3. Copy your deployment URL: `https://your-app.vercel.app`

---

## Step 4: Update CORS Settings

### 4.1 Update Backend Environment Variable

1. Go back to Render dashboard
2. Navigate to your backend service
3. Click **"Environment"**
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. Save changes (this will trigger a redeploy)

---

## Step 5: Configure MongoDB for Production

### 5.1 Update Network Access

1. Go to MongoDB Atlas dashboard
2. Click **"Network Access"**
3. For production, add specific IPs:
   - Get Render's outbound IPs from their docs
   - Or keep `0.0.0.0/0` for simplicity (less secure)

### 5.2 Enable Monitoring

1. In MongoDB Atlas, go to **"Metrics"**
2. Monitor:
   - Connection count
   - Read/Write operations
   - Storage usage

---

## Step 6: Configure Firebase for Production

### 6.1 Update Authorized Domains

1. Go to Firebase Console
2. Click **"Authentication"**
3. Go to **"Settings"** tab
4. Click **"Authorized domains"**
5. Add your Vercel domain:
   ```
   your-app.vercel.app
   ```

### 6.2 Set up App Check (Recommended)

1. In Firebase Console, go to **"App Check"**
2. Click **"Get started"**
3. Register your web app
4. Choose reCAPTCHA v3
5. Add your Vercel domain

---

## Step 7: Test Production Deployment

### 7.1 Create Test User

Use Postman or curl:

```bash
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "SecurePassword123!",
    "name": "Admin User",
    "employeeId": "ADMIN001",
    "role": "admin"
  }'
```

### 7.2 Test Frontend

1. Go to `https://your-app.vercel.app`
2. Login with the test user
3. Verify:
   - ✅ Dashboard loads
   - ✅ Navigation works
   - ✅ API calls succeed
   - ✅ Authentication works

---

## Step 8: Custom Domain (Optional)

### 8.1 Add Custom Domain to Vercel

1. In Vercel project settings, click **"Domains"**
2. Enter your domain: `taskmanager.yourcompany.com`
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take 48 hours)

### 8.2 Update Firebase Authorized Domains

Add your custom domain to Firebase authorized domains.

### 8.3 Update Backend CORS

Update `FRONTEND_URL` in Render to include custom domain.

---

## Production Best Practices

### Security

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **Database**
   - Use specific IP whitelist (not 0.0.0.0/0)
   - Create read-only users for analytics
   - Enable audit logging

3. **API**
   - Implement rate limiting
   - Add request validation
   - Log all errors
   - Use HTTPS only

4. **Authentication**
   - Enforce strong passwords
   - Enable MFA for admin accounts
   - Set token expiration
   - Implement session management

### Monitoring

1. **Render**
   - Monitor service health
   - Check logs regularly
   - Set up alerts

2. **MongoDB Atlas**
   - Monitor query performance
   - Track storage usage
   - Set up alerts for issues

3. **Vercel**
   - Monitor build times
   - Check analytics
   - Review error logs

4. **Firebase**
   - Monitor authentication usage
   - Check for suspicious activity
   - Review quota limits

### Performance

1. **Backend**
   - Enable compression
   - Add caching
   - Optimize database queries
   - Use connection pooling

2. **Frontend**
   - Lazy load components
   - Optimize images
   - Enable code splitting
   - Use CDN for assets

3. **Database**
   - Add appropriate indexes
   - Monitor slow queries
   - Optimize schema

---

## Continuous Deployment

### Automatic Deployments

Both Vercel and Render support auto-deployment:

**Vercel:**
- Automatically deploys on push to `main` branch
- Preview deployments for pull requests

**Render:**
- Auto-deploys on push to `main`
- Configure in service settings

### Deployment Workflow

```
1. Developer pushes to feature branch
2. Create pull request
3. Vercel creates preview deployment
4. Review and test preview
5. Merge to main
6. Auto-deploy to production
```

---

## Rollback Procedure

### Vercel Rollback

1. Go to Vercel project dashboard
2. Click **"Deployments"**
3. Find previous working deployment
4. Click **"..."** → **"Promote to Production"**

### Render Rollback

1. Go to Render service dashboard
2. Click **"Events"**
3. Find previous successful deployment
4. Click **"Rollback to this deploy"**

---

## Scaling Considerations

### Free Tier Limits

**Render:**
- 750 hours/month (enough for 1 service)
- Sleeps after 15 min inactivity
- Wakes on request (cold start ~30s)

**Vercel:**
- 100 GB bandwidth/month
- Unlimited deployments
- Edge network included

**MongoDB Atlas:**
- 512 MB storage
- Shared cluster
- Limited connections

### When to Upgrade

Consider paid plans when:
- Need 24/7 uptime (no sleep)
- Traffic > 100k requests/month
- Storage > 500 MB
- Need dedicated resources
- Require SLA guarantees

### Upgrade Path

1. **Render**: $7/month per service
2. **Vercel**: $20/month (Pro plan)
3. **MongoDB**: $9/month (Shared M2)

---

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check critical alerts
- Review system health

**Weekly:**
- Review performance metrics
- Check database storage
- Update dependencies (if needed)

**Monthly:**
- Rotate secrets/passwords
- Review access logs
- Backup critical data
- Update documentation

---

## Backup Strategy

### Database Backup

**MongoDB Atlas Free Tier:**
- Automated backups NOT included
- Manual export options:
  1. Use `mongodump`:
     ```bash
     mongodump --uri="your-connection-string"
     ```
  2. Schedule weekly dumps
  3. Store in secure location

**Upgrade to M2+ for:**
- Automated daily backups
- Point-in-time recovery
- Backup retention

### Code Backup

- GitHub is your code backup
- Tag releases:
  ```bash
  git tag -a v1.0.0 -m "Production release v1.0.0"
  git push origin v1.0.0
  ```

---

## Monitoring Dashboard

### Key Metrics to Track

1. **Application Health**
   - Uptime percentage
   - Response times
   - Error rates

2. **User Activity**
   - Active users
   - Tasks logged per day
   - Job completion rate

3. **System Performance**
   - API response time
   - Database query time
   - Frontend load time

4. **Business Metrics**
   - Jobs completed
   - Average productivity
   - Alert resolution time

---

## Troubleshooting Production Issues

### Backend Not Responding

1. Check Render service status
2. Review logs in Render dashboard
3. Verify environment variables
4. Check MongoDB connection
5. Test with `/health` endpoint

### Frontend Can't Connect to Backend

1. Verify `VITE_API_URL` is correct
2. Check CORS settings
3. Ensure backend is running
4. Check browser console for errors
5. Test API with curl/Postman

### Authentication Failures

1. Verify Firebase configuration
2. Check authorized domains
3. Review Firebase console logs
4. Test with new user registration

### Database Connection Issues

1. Check MongoDB cluster status
2. Verify connection string
3. Check IP whitelist
4. Review MongoDB logs

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Firebase Docs**: https://firebase.google.com/docs

---

## Checklist

Before going live:

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] MongoDB Atlas configured
- [ ] Firebase authentication working
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Test user created successfully
- [ ] All features tested in production
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team trained on system

---

**Congratulations!** 🎉 Your Technician Task Management System is now live in production!
