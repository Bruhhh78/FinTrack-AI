# FinTrack AI - Deployment Guide

Complete guide to deploy FinTrack AI to production.

## Pre-Deployment Checklist

### Security
- [ ] Change JWT_SECRET in backend .env
- [ ] Update database credentials
- [ ] Enable HTTPS everywhere
- [ ] Configure CORS for specific domains
- [ ] Remove debug logging
- [ ] Test all input validations
- [ ] Check for hardcoded credentials

### Performance
- [ ] Build frontend optimized bundle
- [ ] Enable gzip compression
- [ ] Setup CDN for static assets
- [ ] Optimize database indexes
- [ ] Configure caching headers

### Testing
- [ ] Test all user flows
- [ ] Test on mobile devices
- [ ] Check form validations
- [ ] Test error handling
- [ ] Verify all API endpoints
- [ ] Test budget alerts
- [ ] Verify goal tracking

## Option 1: Vercel + Railway (Recommended)

### Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub/GitLab/Bitbucket

2. **Connect Repository**
   ```bash
   cd frontend
   npm install -g vercel
   vercel
   ```

3. **Configure Environment**
   - In Vercel dashboard, set environment variables:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

4. **Deploy**
   - Vercel auto-deploys on git push
   - Custom domain setup in Vercel dashboard

### Deploy Backend to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "Create New"
   - Select "Deploy from GitHub"
   - Choose your repository

3. **Configure Variables**
   - In Railway dashboard, add:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-strong-secret-key
   NODE_ENV=production
   PORT=5000
   ```

4. **Deploy**
   - Railway auto-deploys from git
   - Get your API URL from Railway

### Setup MongoDB Atlas

1. **Create Free Cluster**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Sign up free
   - Create a cluster

2. **Get Connection String**
   - In Atlas, click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/fintrack-ai`

3. **Create Database User**
   - Username: your-username
   - Password: strong-password
   - Save these securely

4. **Add to Environment Variables**
   - Backend: Add to `.env` → `MONGODB_URI`
   - Railway: Add as project variable

## Option 2: Heroku Deployment (Legacy)

### Deploy Backend

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add MongoDB Atlas URI
heroku config:set MONGODB_URI=mongodb+srv://...

# Add JWT secret
heroku config:set JWT_SECRET=your-secret-key

# Deploy
git push heroku main
```

### Get Backend URL
```bash
heroku open
# Note: yourapp.herokuapp.com
```

### Deploy Frontend

Update `frontend/.env.local`:
```
VITE_API_URL=https://your-app-name.herokuapp.com/api
```

Then deploy to Vercel/Netlify as shown above.

## Option 3: Docker Deployment

### Build Docker Images

```bash
# From root directory
docker-compose build
```

### Push to Docker Hub

```bash
# Login
docker login

# Build and tag
docker build -t your-username/fintrack-backend ./backend
docker build -t your-username/fintrack-frontend ./frontend

# Push
docker push your-username/fintrack-backend
docker push your-username/fintrack-frontend
```

### Deploy on Server (DigitalOcean, AWS, etc.)

```bash
# SSH into server
ssh root@your-server-ip

# Clone docker-compose.yml
git clone your-repo
cd fintrack-ai

# Edit .env with production values
nano .env

# Start containers
docker-compose up -d

# Check status
docker-compose ps
```

## Option 4: AWS Deployment

### Deploy Frontend (S3 + CloudFront)

1. **Build Frontend**
```bash
cd frontend
npm run build
# Creates 'dist' folder
```

2. **Create S3 Bucket**
   - AWS Console → S3
   - Create bucket: `fintrack-app`
   - Enable Static Website Hosting
   - Upload contents of `dist/` folder

3. **Setup CloudFront**
   - AWS Console → CloudFront
   - Create distribution
   - Origin: Your S3 bucket
   - Set custom domain

### Deploy Backend (EC2)

1. **Create EC2 Instance**
   - Ubuntu 20.04 LTS
   - t2.micro (free tier)
   - Security group: Allow 5000

2. **SSH and Setup**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repo
git clone your-repo
cd fintrack-ai/backend

# Install dependencies
npm install

# Start with PM2
PM2_HOME=/root/.pm2 pm2 start server.js --name fintrack

# Setup reverse proxy (Nginx)
sudo apt install -y nginx
# Configure Nginx to forward to port 5000
```

3. **Setup Environment**
```bash
# Create .env
nano .env
# Add MONGODB_URI, JWT_SECRET, etc.

# Start server
npm start
```

## Environment Variables for Production

### Backend (.env)
```
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fintrack-ai

# Security
JWT_SECRET=very-long-random-secret-key-with-symbols-!@#$%

# Server
PORT=5000
NODE_ENV=production

# Optional API Keys
GEMINI_API_KEY=your-key-for-ai-features
```

### Frontend (.env.local / .env.production)
```
VITE_API_URL=https://api.your-domain.com/api
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d your-domain.com

# Auto-renew
sudo certbot renew --dry-run
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name api.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## Domain Setup

### Point Domain to Deployment

**For Vercel:**
- Vercel Dashboard → Settings → Domains
- Add your domain
- Update DNS records (Vercel provides these)

**For Railway:**
- Railway Dashboard → Project → Settings
- Add custom domain
- Update DNS CNAME record

**For Self-hosted:**
- Update DNS A record to your server IP

## Monitoring & Logging

### Setup PM2 Logs

```bash
# View logs
pm2 logs fintrack

# Setup log rotation
pm2 install pm2-logrotate

# Monitor process
pm2 monit
```

### Monitor Database

1. **MongoDB Atlas Monitoring**
   - Atlas Dashboard → Monitoring
   - Check query performance
   - Monitor storage usage
   - Set alerts

### Setup Error Tracking

Optional services:
- Sentry for error tracking
- LogRocket for user session replay
- DataDog for comprehensive monitoring

## Performance Optimization

### Frontend

```bash
# Build with analysis
npm run build -- --visualizer

# Results in dist folder
# Optimize large packages if needed
```

### Backend

1. **Database Indexing** - Already configured
2. **Caching** - Enable Redis if needed
3. **Compression** - Already enabled
4. **Rate Limiting** - Consider adding

### CDN

- Frontend assets via CloudFront/Vercel
- Use edge caching
- Enable compression

## Backup Strategy

### Database Backups

**MongoDB Atlas:**
- Automatic daily backups (included)
- Point-in-time recovery
- Configure retention policy

### Manual Backup

```bash
# Export database
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/fintrack-ai"

# Creates 'dump' folder
# Upload to cloud storage
```

## Scaling Considerations

### When to Scale

1. **Users > 10,000** → Add database read replicas
2. **Requests > 1000/min** → Add load balancer
3. **Storage > 100GB** → Archive old data

### Database Scaling

- MongoDB Atlas auto-sharding
- Read-only replicas for reporting
- Archive old transactions

### Server Scaling

- Load balancer (Nginx, HAProxy)
- Multiple backend instances
- Session management (Redis)

## Post-Deployment

### Verify Deployment

1. Test login/register
2. Add test expense
3. Check dashboard loads
4. Verify budget calculation
5. Test analytics charts
6. Check mobile responsiveness

### Setup Monitoring

```bash
# Monitor uptime
# Use: Pingdom, Uptime Robot, or StatusPage

# Monitor errors
# Use: Sentry.io

# Monitor performance
# Use: New Relic or DataDog
```

### Continuous Deployment

Setup CI/CD:
- GitHub Actions
- GitLab CI
- Jenkins
- TravisCI

Example GitHub Actions:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway deploy
```

## Troubleshooting Deployment

### Backend Won't Connect to Database
```
Error: MongoServerError: connect ECONNREFUSED
```
Solution:
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0)
- Verify connection string
- Check username/password

### Frontend Can't Connect to API
```
Error: CORS policy: blocked by CORS
```
Solution:
- Add frontend URL to backend CORS
- Check VITE_API_URL is correct
- Verify backend is running

### High Memory Usage
```
Error: JavaScript heap out of memory
```
Solution:
- Check for memory leaks
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096`
- Optimize queries

## Maintenance Tasks

### Regular Maintenance

Daily:
- Check error logs
- Monitor disk space
- Verify backups

Weekly:
- Update dependencies (npm)
- Review user feedback
- Analyze performance

Monthly:
- Update OS patches
- Review security settings
- Optimize database
- Archive old data

### Update Process

```bash
# Update packages
npm update

# Check for vulnerabilities
npm audit

# Update dependencies carefully
npm install package@latest

# Test thoroughly before deployment
npm run build
npm start

# Deploy if all tests pass
git push main
```

## Security Maintenance

### Regular Security Checks

```bash
# Check for vulnerable packages
npm audit

# Update packages securely
npm audit fix

# Check OWASP top 10
# Review authentication
# Verify input validation
# Check CORS settings
```

### Password Rotation

- Rotate JWT_SECRET monthly
- Update database user password quarterly
- Use password manager

## Disaster Recovery

### If Site Goes Down

1. Check status page
2. Check logs for errors
3. Verify database connection
4. Restart server processes
5. Rollback latest changes if needed
6. Check backups

### Rollback Procedure

```bash
# If deployment causes issues
git revert HEAD
git push main

# Redeploy previous version
vercel rollback (for Vercel)
railway deploy (to re-deploy)
```

---

**Need Help?** Check the troubleshooting guides in README.md and SETUP.md

**Remember:** Always test in staging before deploying to production! 🚀
