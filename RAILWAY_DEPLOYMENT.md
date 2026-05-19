# 🚀 Railway Deployment Quick Start

## What You're Deploying

A full-stack GTM + LinkedIn setup application with:
- 🔐 User authentication (login/register)
- 📋 Interactive 33-task checklist across 6 phases
- 🗝️ Secure credential management (GTM + LinkedIn)
- 📊 Mermaid diagrams for visual workflows
- 💾 PostgreSQL database for persistent storage
- ⚡ Express.js backend on Node.js

## Pre-Deployment Checklist

- [ ] GitHub account with repo containing this code
- [ ] Railway.app account (free tier works)
- [ ] About 5 minutes to deploy

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial GTM + LinkedIn app setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gtm-linkedin-app.git
git push -u origin main
```

### 2. Sign Up for Railway

Go to [railway.app](https://railway.app) and sign up with GitHub.

### 3. Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Find and select your `gtm-linkedin-app` repository
4. Click "Deploy Now"

### 4. Create PostgreSQL Database

1. In your Railway project dashboard
2. Click "Create" → "Database" → "PostgreSQL"
3. Railway automatically adds `DATABASE_URL` environment variable

### 5. Initialize Database Schema

1. Click on your PostgreSQL service in Railway
2. Go to "Connect" tab
3. Copy the connection string
4. In your terminal:
   ```bash
   psql YOUR_RAILWAY_DATABASE_URL < db/schema.sql
   ```
   
   Or use Railway's built-in terminal:
   - Click "Railway Shell" at the bottom
   - Run: `psql $DATABASE_URL < db/schema.sql`

### 6. Set Environment Variables

1. In Railway dashboard, click the Node service
2. Go to "Variables"
3. Add these variables:
   ```
   NODE_ENV=production
   JWT_SECRET=generate-a-random-string-here
   PORT=3000
   ```

To generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 7. Deploy

Railway auto-deploys when you push to GitHub, but you can also:
1. Click "Deploy" button in dashboard
2. Wait for green checkmark

### 8. Get Your Public URL

1. In Railway dashboard, click the Node service
2. Click "Generate Domain" under "Deployments"
3. You'll get a URL like: `https://gtm-linkedin-app-production.up.railway.app`

## After Deployment

### First Login

Use demo credentials:
- Email: `demo@example.com`
- Password: `demo123456`

Or create a new account.

### Verify It's Working

1. Open your Railway URL
2. Login page should appear
3. Click "Create Account" or login with demo credentials
4. You should see the dashboard with tabs:
   - Implementation Checklist
   - Credentials
   - Diagrams

### Set Up Your Account

1. Go to "Credentials" tab
2. Add your GTM Account ID and Container ID
3. Add your LinkedIn Ad Account ID and Partner ID
4. Start checking off tasks in the checklist

## Monitoring

### View Logs

```bash
railway logs -t node
```

Or in dashboard: Click service → "Logs"

### Check Database

```bash
railway connect -d postgres
```

Then run SQL commands like:
```sql
SELECT * FROM users;
SELECT * FROM gtm_credentials;
SELECT * FROM implementation_progress;
```

## Troubleshooting

### Blank page / 500 error

**Check Node logs:**
```bash
railway logs -t node
```

**Common causes:**
- Database schema not initialized
- Missing environment variables
- Node modules not installed

**Fix:**
1. Ensure you ran: `psql $DATABASE_URL < db/schema.sql`
2. Verify all environment variables are set
3. Redeploy: Push a new commit or click Deploy button

### Database connection error

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

If it fails, recreate the database:
1. Go to PostgreSQL service in Railway
2. Click "Reset Data" (⚠️ deletes all data)
3. Reinitialize schema: `psql $DATABASE_URL < db/schema.sql`

### Port error ("Port 3000 already in use")

Railway automatically manages ports. If you get this error:
1. Check that PORT environment variable is set
2. Or let Railway assign an automatic port (remove PORT variable)

## Updating the App

After making changes locally:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Railway auto-deploys. Check the "Deployments" tab to see build progress.

## Custom Domain (Optional)

1. In Railway dashboard, click Node service
2. Under "Domains" → "Add Custom Domain"
3. Point your domain DNS to Railway
4. Takes ~5-10 minutes to activate

## Environment Variables Reference

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| DATABASE_URL | ✅ | `postgresql://...` | Auto-set by Railway PostgreSQL |
| NODE_ENV | ✅ | `production` | Do not use `development` |
| JWT_SECRET | ✅ | `abc123xyz...` | Generate with crypto |
| PORT | | `3000` | Optional, auto-assigned by Railway |
| ADMIN_EMAIL | | `admin@example.com` | For initial setup |
| ADMIN_PASSWORD | | `strong-pass` | For initial setup |

## Performance Tips

- Database queries are indexed for speed
- Connection pooling handles 10+ concurrent users
- Mermaid diagrams load on-demand
- Task updates sync in real-time to database

## Scaling Up

If you exceed free tier limits:
1. Upgrade to Railway Pro ($5-20/month depending on usage)
2. Automatic scaling for more traffic
3. 500GB/month data transfer included

## Backup Data

```bash
# Backup PostgreSQL
pg_dump $DATABASE_URL > backup.sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```

## Next Steps

1. ✅ Deploy on Railway (you're here!)
2. Share URL with your team
3. Users register and add credentials
4. Start tracking tasks in checklist
5. Monitor conversions in LinkedIn Campaign Manager

## Support

- **Railway Docs:** https://docs.railway.app
- **Node.js on Railway:** https://docs.railway.app/guides/node
- **PostgreSQL on Railway:** https://docs.railway.app/guides/postgresql

---

**Questions?** Check the README.md in the project root or review the GTM implementation guide.

**Happy deploying!** 🎉
