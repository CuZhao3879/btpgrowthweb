# Deployment Guide

## Deploying to DigitalOcean Droplet

### Prerequisites
- Ubuntu 20.04 or higher droplet
- Node.js 18+ installed
- Domain name pointed to your droplet's IP

### Step 1: Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 globally
sudo npm install -g pm2
```

### Step 2: Clone and Setup Project

```bash
# Clone your repository
git clone https://github.com/yourusername/btpgrowthweb.git
cd btpgrowthweb

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit environment variables
nano .env.local
```

### Step 3: Build Project

```bash
# Build the Next.js application
npm run build

# Test the build
npm start
```

### Step 4: Setup PM2

```bash
# Start application with PM2
pm2 start npm --name "btpgrowth" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions from the command output

# Check status
pm2 status
pm2 logs btpgrowth
```

### Step 5: Setup Nginx as Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/btpgrowth
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/btpgrowth /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 6: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
# Test renewal with:
sudo certbot renew --dry-run
```

### Step 7: Setup Firewall

```bash
# Enable UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

## Continuous Deployment with GitHub Actions

### Step 1: Setup SSH Key

On your local machine:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "github-actions"

# Copy public key to server
ssh-copy-id user@your-server-ip
```

### Step 2: Add GitHub Secrets

In your GitHub repository:
1. Go to Settings > Secrets and Variables > Actions
2. Add the following secrets:
   - `DEPLOY_HOST`: Your server IP
   - `DEPLOY_USER`: SSH username
   - `DEPLOY_KEY`: Private SSH key content
   - `DEPLOY_PATH`: /path/to/btpgrowthweb

### Step 3: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to DigitalOcean

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy to DigitalOcean
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd ${{ secrets.DEPLOY_PATH }}
            git pull origin main
            npm install
            npm run build
            pm2 restart btpgrowth
```

## Useful PM2 Commands

```bash
# View logs
pm2 logs btpgrowth

# Restart application
pm2 restart btpgrowth

# Stop application
pm2 stop btpgrowth

# Delete from PM2
pm2 delete btpgrowth

# Monitor resources
pm2 monit

# List all processes
pm2 list
```

## Updating the Application

```bash
# Pull latest changes
cd /path/to/btpgrowthweb
git pull origin main

# Install new dependencies (if any)
npm install

# Rebuild
npm run build

# Restart with PM2
pm2 restart btpgrowth
```

## Troubleshooting

### Application won't start
```bash
# Check PM2 logs
pm2 logs btpgrowth

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart PM2
pm2 restart btpgrowth
```

### Nginx errors
```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### SSL certificate issues
```bash
# Renew certificates manually
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

## Performance Optimization

### Enable Compression

Edit Nginx config to add compression:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### Setup Caching

```nginx
# Add inside server block
location /_next/static {
    alias /path/to/btpgrowthweb/.next/static;
    expires 365d;
    access_log off;
}
```

## Backup Strategy

```bash
# Create backup script
cat > ~/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup project files
tar -czf $BACKUP_DIR/btpgrowth_$DATE.tar.gz -C /path/to btpgrowthweb

# Keep only last 7 backups
ls -t $BACKUP_DIR/btpgrowth_*.tar.gz | tail -n +8 | xargs rm -f
EOF

chmod +x ~/backup.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * ~/backup.sh
```

## Monitoring

### Setup basic monitoring with PM2 Plus (optional)

```bash
# Link to PM2 Plus for advanced monitoring
pm2 link <secret> <public>
```

For more information, visit:
- PM2 Documentation: https://pm2.keymetrics.io/
- Nginx Documentation: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/

