# 🚀 OTTSONLY - Complete Production Deployment Guide

## VPS Requirements
- **OS:** Ubuntu 22.04 LTS (Clean install recommended)
- **RAM:** 8GB
- **vCPU:** 2 cores
- **Storage:** 50GB
- **Ports:** 80, 443, 22, 8000 (temporarily)

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Critical Issues to Fix Before Deployment

#### 🔴 SECURITY VULNERABILITIES
1. **MongoDB Credentials in Code**
   - ⚠️ Remove hardcoded credentials from `backend/seed_admin.py` (FIXED)
   - ⚠️ All credentials must be in `.env` only

2. **Admin Password Exposure**
   - ⚠️ Admin password removed from frontend (FIXED)
   - ✅ Change default admin password after first login

3. **CORS Configuration**
   - ✅ Currently hardcoded localhost URLs in `backend/main.py`
   - ❗ Update to production domains before deployment

4. **JWT Secrets**
   - ⚠️ Generate new production secrets
   - ❗ NEVER use development secrets in production

#### ⚠️ MISSING PRODUCTION CONFIGURATIONS

1. **No Production CORS Origins**
   ```python
   # Current (lines 60-64 in main.py):
   allowed_origins = [
       settings.FRONTEND_URL,
       settings.ADMIN_URL,
       "http://127.0.0.1:4028",  # Remove for production
       "http://127.0.0.1:3001",  # Remove for production
   ]
   ```

2. **No Rate Limiting Middleware**
   - Currently only configured, not implemented
   - Add Slowapi or similar

3. **No HTTPS Enforcement**
   - Missing redirect middleware
   - Should force HTTPS in production

4. **No Request Size Limits**
   - Missing body size limits
   - Vulnerable to DoS attacks

5. **No Logging Configuration**
   - No structured logging
   - No error tracking (Sentry, etc.)

6. **No Health Check Endpoint for Load Balancer**
   - Basic root endpoint exists but no detailed health

#### 📦 MISSING FILES

1. **No `docker-compose.yml`** (Optional but recommended)
2. **No Nginx configuration file**
3. **No systemd service files**
4. **No backup scripts**
5. **No monitoring setup**

---

## 🛠️ STEP-BY-STEP DEPLOYMENT

### Step 1: Initial VPS Setup (15 minutes)

#### 1.1 Connect to VPS
```bash
ssh root@your-vps-ip
```

#### 1.2 Update System
```bash
# Update package lists
apt update

# Upgrade all packages
apt upgrade -y

# Install essential tools
apt install -y curl git wget vim ufw fail2ban build-essential
```

#### 1.3 Create Non-Root User
```bash
# Create user
adduser ottsonly

# Add to sudo group
usermod -aG sudo ottsonly

# Switch to new user
su - ottsonly
```

---

### Step 2: Install Dependencies (20 minutes)

#### 2.1 Install Node.js 20 LTS
```bash
# Install Node.js using NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show v10.x.x
```

#### 2.2 Install Python 3.11
```bash
# Install Python 3.11
sudo apt install -y python3.11 python3.11-venv python3-pip python3.11-dev

# Set Python 3.11 as default
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1

# Verify installation
python3 --version  # Should show Python 3.11.x
```

#### 2.3 Install Nginx
```bash
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

#### 2.4 Install Certbot (Let's Encrypt)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

#### 2.5 Install PM2 (Process Manager)
```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

---

### Step 3: Clone Repository & Setup Project (10 minutes)

#### 3.1 Clone Repository
```bash
cd /home/ottsonly
git clone https://github.com/encrypted69-code/ottsonly-web.git
cd ottsonly-web
```

#### 3.2 Setup Backend
```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Verify installation
python -c "import fastapi; print('FastAPI installed successfully')"
```

#### 3.3 Setup Frontend Main
```bash
cd ../frontend-main

# Install dependencies
npm install

# This will take 2-5 minutes
# Expected output: "added XXX packages"
```

#### 3.4 Setup Frontend Admin
```bash
cd ../frontend-admin

# Install dependencies
npm install
```

---

### Step 4: Configure Environment Variables (15 minutes)

#### 4.1 Backend Environment

```bash
cd /home/ottsonly/ottsonly-web/backend
cp .env.example .env
nano .env
```

**Production `.env` configuration:**
```bash
# Application
APP_NAME=OTTSONLY
DEBUG=False
ENVIRONMENT=production

# MongoDB Atlas (Use your existing connection)
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?appName=ottsonly
DATABASE_NAME=ottsonly_db

# JWT Secrets (GENERATE NEW ONES!)
# Generate with: openssl rand -hex 64
SECRET_KEY=GENERATE_NEW_64_CHAR_HEX_STRING_HERE
REFRESH_SECRET_KEY=GENERATE_NEW_64_CHAR_HEX_STRING_HERE
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
REFRESH_TOKEN_EXPIRE_DAYS=7

# Admin Configuration
SUPER_ADMIN_EMAIL=admin@ottsonly.com
SUPER_ADMIN_PASSWORD=CHANGE_THIS_SECURE_PASSWORD_MIN_16_CHARS

# Server Configuration (CRITICAL - Update these!)
BACKEND_PORT=8000
FRONTEND_URL=https://ottsonly.com
ADMIN_URL=https://admin.ottsonly.com

# File Upload
UPLOAD_DIR=/home/ottsonly/ottsonly-web/backend/uploads
MAX_FILE_SIZE=5242880

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_PER_MINUTE=60

# Razorpay (Use LIVE keys for production)
RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE

# Telegram Bot (Optional)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_ADMIN_CHAT_ID=your_chat_id_here

# n8n Webhooks
N8N_WEBHOOK_URL=

# YouTube Settings
YOUTUBE_MAX_EDITS=1

# Default Wallet Balance
DEFAULT_WALLET_BALANCE=0
```

**Generate secure secrets:**
```bash
# Generate SECRET_KEY
openssl rand -hex 64

# Generate REFRESH_SECRET_KEY
openssl rand -hex 64
```

#### 4.2 Frontend Main Environment
```bash
cd /home/ottsonly/ottsonly-web/frontend-main
cp .env.example .env
nano .env
```

**Frontend Main `.env`:**
```bash
# API Base URL
VITE_API_URL=https://api.ottsonly.com

# Other API keys if needed
VITE_GOOGLE_ANALYTICS_ID=your-ga-id-here
```

#### 4.3 Frontend Admin Environment
```bash
cd /home/ottsonly/ottsonly-web/frontend-admin
cp .env.example .env
nano .env
```

**Frontend Admin `.env`:**
```bash
# API Base URL
VITE_API_URL=https://api.ottsonly.com

# Other configurations
```

#### 4.4 Update CORS in Backend
```bash
nano /home/ottsonly/ottsonly-web/backend/main.py
```

**Update lines 60-64:**
```python
# REMOVE localhost entries for production
allowed_origins = [
    settings.FRONTEND_URL,      # https://ottsonly.com
    settings.ADMIN_URL,         # https://admin.ottsonly.com
]
```

---

### Step 5: Build Frontend Applications (10 minutes)

#### 5.1 Build Main Frontend
```bash
cd /home/ottsonly/ottsonly-web/frontend-main
npm run build

# Output: dist/ folder with optimized static files
# Expected: "Build completed successfully"
```

**Common Build Errors:**
```
Error: ENOSPC: System limit for number of file watchers reached
Solution: sudo sysctl fs.inotify.max_user_watches=524288
```

```
Error: JavaScript heap out of memory
Solution: NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

#### 5.2 Build Admin Frontend
```bash
cd /home/ottsonly/ottsonly-web/frontend-admin
npm run build

# Output: dist/ folder
```

#### 5.3 Verify Builds
```bash
# Check build outputs
ls -lh /home/ottsonly/ottsonly-web/frontend-main/dist
ls -lh /home/ottsonly/ottsonly-web/frontend-admin/dist

# Both should contain index.html, assets/, etc.
```

---

### Step 6: Setup Process Managers (15 minutes)

#### 6.1 Create PM2 Ecosystem File
```bash
cd /home/ottsonly/ottsonly-web
nano ecosystem.config.js
```

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [
    {
      name: 'ottsonly-backend',
      cwd: '/home/ottsonly/ottsonly-web/backend',
      script: '/home/ottsonly/ottsonly-web/backend/venv/bin/uvicorn',
      args: 'main:app --host 0.0.0.0 --port 8000 --workers 2',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        PYTHONPATH: '/home/ottsonly/ottsonly-web/backend',
        ENVIRONMENT: 'production'
      },
      error_file: '/home/ottsonly/logs/backend-error.log',
      out_file: '/home/ottsonly/logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      min_uptime: '10s',
      max_restarts: 10
    }
  ]
};
```

#### 6.2 Create Log Directory
```bash
mkdir -p /home/ottsonly/logs
```

#### 6.3 Start Backend with PM2
```bash
cd /home/ottsonly/ottsonly-web

# Start application
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs ottsonly-backend --lines 50

# Monitor
pm2 monit
```

#### 6.4 Setup PM2 Startup Script
```bash
# Generate startup script
pm2 startup systemd -u ottsonly --hp /home/ottsonly

# Copy and run the command it outputs (will be like):
# sudo env PATH=... pm2 startup systemd -u ottsonly --hp /home/ottsonly

# Save PM2 process list
pm2 save

# Verify
sudo systemctl status pm2-ottsonly
```

#### 6.5 Test Backend
```bash
# Test local connection
curl http://localhost:8000

# Expected response:
# {"app":"OTTSONLY","version":"1.0.0"...}

# Test health endpoint
curl http://localhost:8000/health
```

---

### Step 7: Configure Nginx (20 minutes)

#### 7.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/ottsonly
```

**Complete Nginx Configuration:**
```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;

# Backend API - api.ottsonly.com
server {
    listen 80;
    server_name api.ottsonly.com;

    # Security headers (HTTP)
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Root for Let's Encrypt challenges
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect all other HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name api.ottsonly.com;

    # SSL Configuration (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/api.ottsonly.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/api.ottsonly.com/privkey.pem;

    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logging
    access_log /var/log/nginx/api.ottsonly.access.log;
    error_log /var/log/nginx/api.ottsonly.error.log warn;

    # Client settings
    client_max_body_size 10M;
    client_body_timeout 60s;
    client_header_timeout 60s;

    # Proxy settings
    location / {
        # Rate limiting
        limit_req zone=api_limit burst=20 nodelay;
        limit_req_status 429;

        # Proxy headers
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # CORS (handled by FastAPI, but backup)
        add_header Access-Control-Allow-Origin "https://ottsonly.com" always;
        add_header Access-Control-Allow-Origin "https://admin.ottsonly.com" always;
    }

    # Special handling for docs
    location ~ ^/(docs|redoc|openapi.json) {
        # Optional: Restrict docs access in production
        # allow your_office_ip;
        # deny all;
        
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Main Frontend - ottsonly.com
server {
    listen 80;
    server_name ottsonly.com www.ottsonly.com;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name ottsonly.com www.ottsonly.com;

    # SSL Configuration (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/ottsonly.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/ottsonly.com/privkey.pem;

    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Root directory
    root /home/ottsonly/ottsonly-web/frontend-main/dist;
    index index.html;

    # Logging
    access_log /var/log/nginx/ottsonly.access.log;
    error_log /var/log/nginx/ottsonly.error.log warn;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React Router handling
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if calling API from same domain)
    location /api/ {
        limit_req zone=general_limit burst=50 nodelay;
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Admin Panel - admin.ottsonly.com
server {
    listen 80;
    server_name admin.ottsonly.com;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name admin.ottsonly.com;

    # SSL Configuration (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/admin.ottsonly.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/admin.ottsonly.com/privkey.pem;

    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Root directory
    root /home/ottsonly/ottsonly-web/frontend-admin/dist;
    index index.html;

    # Logging
    access_log /var/log/nginx/admin.ottsonly.access.log;
    error_log /var/log/nginx/admin.ottsonly.error.log warn;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React Router handling
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional: IP whitelist for admin panel
    # allow your_office_ip;
    # allow your_home_ip;
    # deny all;
}
```

#### 7.2 Enable Site Configuration
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/ottsonly /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Expected: "syntax is ok" and "test is successful"
```

#### 7.3 Restart Nginx
```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

---

### Step 8: DNS Configuration (10 minutes)

#### 8.1 Add DNS Records

**Login to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.)**

**Add these A records:**
```
Type    Name        Value           TTL
A       @           YOUR_VPS_IP     300
A       www         YOUR_VPS_IP     300
A       api         YOUR_VPS_IP     300
A       admin       YOUR_VPS_IP     300
```

**Example:**
```
A       @           203.0.113.45    300
A       www         203.0.113.45    300
A       api         203.0.113.45    300
A       admin       203.0.113.45    300
```

#### 8.2 Verify DNS Propagation
```bash
# Check from VPS
dig ottsonly.com +short
dig www.ottsonly.com +short
dig api.ottsonly.com +short
dig admin.ottsonly.com +short

# All should return your VPS IP
# DNS propagation can take 5 minutes to 48 hours
```

**Alternative verification:**
```bash
# Use online tools:
# https://dnschecker.org
# https://www.whatsmydns.net
```

---

### Step 9: SSL Certificates with Let's Encrypt (10 minutes)

#### 9.1 Obtain SSL Certificates

**IMPORTANT:** Wait for DNS to fully propagate before running this!

```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Obtain certificates for all domains
sudo certbot certonly --standalone -d ottsonly.com -d www.ottsonly.com
sudo certbot certonly --standalone -d api.ottsonly.com
sudo certbot certonly --standalone -d admin.ottsonly.com

# Follow prompts:
# - Enter your email
# - Agree to Terms of Service
# - Choose whether to share email with EFF
```

**Expected output:**
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/ottsonly.com/fullchain.pem
Key is saved at: /etc/letsencrypt/live/ottsonly.com/privkey.pem
```

#### 9.2 Update Nginx with SSL
```bash
# Uncomment SSL certificate lines in Nginx config
sudo nano /etc/nginx/sites-available/ottsonly

# Uncomment these lines for each server block:
# ssl_certificate /etc/letsencrypt/live/domain.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/domain.com/privkey.pem;
```

#### 9.3 Test and Restart Nginx
```bash
# Test configuration
sudo nginx -t

# Start Nginx
sudo systemctl start nginx

# Verify SSL
curl -I https://ottsonly.com
curl -I https://api.ottsonly.com
curl -I https://admin.ottsonly.com
```

#### 9.4 Setup Auto-Renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up cron job
# Verify cron job
sudo systemctl list-timers | grep certbot

# Expected: certbot.timer should be listed
```

---

### Step 10: Firewall & Security (20 minutes)

#### 10.1 Configure UFW Firewall
```bash
# Check status
sudo ufw status

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (CRITICAL - Do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Verify rules
sudo ufw status numbered

# Expected output:
# Status: active
# [1] 22/tcp     ALLOW IN    Anywhere
# [2] 80/tcp     ALLOW IN    Anywhere
# [3] 443/tcp    ALLOW IN    Anywhere
```

#### 10.2 SSH Hardening
```bash
# Backup SSH config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Edit SSH config
sudo nano /etc/ssh/sshd_config
```

**Update these settings:**
```bash
# Disable root login
PermitRootLogin no

# Disable password authentication (use SSH keys only)
PasswordAuthentication no
PubkeyAuthentication yes

# Disable empty passwords
PermitEmptyPasswords no

# Change default port (optional but recommended)
# Port 2222

# Allow only specific user
AllowUsers ottsonly

# Disable X11 forwarding
X11Forwarding no

# Set login grace time
LoginGraceTime 60

# Max authentication attempts
MaxAuthTries 3

# Max sessions
MaxSessions 2
```

**Restart SSH:**
```bash
sudo systemctl restart sshd

# IMPORTANT: Test new connection in a separate window before closing current session!
# ssh ottsonly@your-vps-ip -p 22 (or 2222 if you changed port)
```

**If you changed SSH port, update firewall:**
```bash
sudo ufw allow 2222/tcp
sudo ufw delete allow 22/tcp
```

#### 10.3 Setup Fail2Ban
```bash
# Install fail2ban
sudo apt install -y fail2ban

# Create local configuration
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

**Update jail.local:**
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
destemail = admin@ottsonly.com
sender = alerts@ottsonly.com

[sshd]
enabled = true
port = 22
logpath = /var/log/auth.log
maxretry = 3
bantime = 7200

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
```

**Create Nginx limit filter:**
```bash
sudo nano /etc/fail2ban/filter.d/nginx-limit-req.conf
```

```ini
[Definition]
failregex = limiting requests, excess:.* by zone.*client: <HOST>
ignoreregex =
```

**Start Fail2Ban:**
```bash
# Start service
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Check status
sudo fail2ban-client status

# Check SSH jail status
sudo fail2ban-client status sshd
```

#### 10.4 Additional Security Measures

**Disable unused services:**
```bash
# List all services
systemctl list-unit-files --type=service --state=enabled

# Disable unnecessary ones (examples)
sudo systemctl disable bluetooth.service
sudo systemctl disable cups.service
```

**Setup automatic security updates:**
```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
# Select "Yes"
```

**Install and configure AppArmor:**
```bash
# Check if AppArmor is running
sudo aa-status

# If not installed
sudo apt install -y apparmor apparmor-utils

# Enable AppArmor
sudo systemctl enable apparmor
sudo systemctl start apparmor
```

---

### Step 11: Database & Seed Data (10 minutes)

#### 11.1 Create Admin User
```bash
cd /home/ottsonly/ottsonly-web/backend
source venv/bin/activate

# Run admin seed script
python seed_admin.py

# Expected output:
# ✅ Admin user created with ID: ...
# 📧 Email: admin@ottsonly.com
```

#### 11.2 Seed Demo Products (Optional)
```bash
# Create demo products
python create_demo_products.py

# Expected output:
# ✅ Created Netflix ₹99
# ✅ Created Amazon Prime ₹35
# etc.
```

#### 11.3 Verify Database Connection
```bash
# Test database connection
python -c "
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings
import asyncio

async def test():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    count = await db.users.count_documents({})
    print(f'✅ Connected! Found {count} users in database')
    client.close()

asyncio.run(test())
"
```

---

### Step 12: Production Testing (30 minutes)

#### 12.1 Backend API Testing

**Test health endpoint:**
```bash
curl https://api.ottsonly.com/

# Expected:
# {"app":"OTTSONLY","version":"1.0.0","status":"healthy"}
```

**Test authentication:**
```bash
# Register new user
curl -X POST https://api.ottsonly.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# Expected: {"message":"Registration successful",...}
```

**Test login:**
```bash
curl -X POST https://api.ottsonly.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# Expected: {"access_token":"...","token_type":"bearer"}
```

**Test products endpoint:**
```bash
curl https://api.ottsonly.com/products/

# Expected: [{"id":"...","name":"Netflix",...}]
```

**Test admin login:**
```bash
curl -X POST https://api.ottsonly.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ottsonly.com",
    "password": "YOUR_ADMIN_PASSWORD"
  }'

# Expected: {"access_token":"...","user":{...,"role":"admin"}}
```

#### 12.2 Frontend Testing

**Test main website:**
```bash
# Check if site loads
curl -I https://ottsonly.com

# Expected: HTTP/2 200
# Content-Type: text/html

# Test in browser:
# 1. Visit https://ottsonly.com
# 2. Check if page loads correctly
# 3. Test registration
# 4. Test login
# 5. Test product listing
# 6. Check console for errors (F12)
```

**Test admin panel:**
```bash
# Visit https://admin.ottsonly.com
# 1. Login with admin credentials
# 2. Check dashboard
# 3. Test user management
# 4. Test product management
# 5. Test orders view
```

#### 12.3 Payment Testing

**IMPORTANT:** Test with Razorpay TEST keys first!

**Update .env temporarily:**
```bash
cd /home/ottsonly/ottsonly-web/backend
nano .env

# Change to test keys:
RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY
RAZORPAY_KEY_SECRET=YOUR_TEST_SECRET

# Restart backend
pm2 restart ottsonly-backend
```

**Test payment flow:**
1. Add money to wallet
2. Use test cards from Razorpay docs:
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date
3. Verify payment success
4. Check wallet balance updated
5. Purchase a product
6. Verify order created

**After testing, revert to LIVE keys:**
```bash
nano .env
# Change back to: RAZORPAY_KEY_ID=rzp_live_...
pm2 restart ottsonly-backend
```

#### 12.4 Wallet & Transactions Testing
```bash
# Test wallet endpoints
TOKEN="your_access_token_here"

# Get wallet balance
curl https://api.ottsonly.com/wallet/balance \
  -H "Authorization: Bearer $TOKEN"

# Create order
curl -X POST https://api.ottsonly.com/wallet/create-order \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100}'

# Get transactions
curl https://api.ottsonly.com/wallet/transactions \
  -H "Authorization: Bearer $TOKEN"
```

#### 12.5 Referral System Testing
```bash
# Test referral code generation
curl https://api.ottsonly.com/referrals/dashboard \
  -H "Authorization: Bearer $TOKEN"

# Test referral registration
curl -X POST https://api.ottsonly.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Referred User",
    "email": "referred@example.com",
    "password": "Pass123!",
    "referral_code": "ABC123"
  }'
```

---

### Step 13: Monitoring & Logging (15 minutes)

#### 13.1 Setup PM2 Monitoring
```bash
# Monitor processes in real-time
pm2 monit

# View logs
pm2 logs ottsonly-backend --lines 100

# Check memory usage
pm2 list
```

#### 13.2 Setup Nginx Log Monitoring
```bash
# Real-time access logs
sudo tail -f /var/log/nginx/api.ottsonly.access.log

# Real-time error logs
sudo tail -f /var/log/nginx/api.ottsonly.error.log

# Check for errors
sudo grep "error" /var/log/nginx/*.log | tail -20
```

#### 13.3 System Resource Monitoring
```bash
# Install htop
sudo apt install -y htop

# Monitor system
htop

# Check disk usage
df -h

# Check memory
free -h

# Check CPU
top
```

#### 13.4 Setup Log Rotation
```bash
# Create PM2 log rotation config
sudo nano /etc/logrotate.d/pm2-ottsonly
```

```
/home/ottsonly/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
    create 0644 ottsonly ottsonly
}
```

**Test log rotation:**
```bash
sudo logrotate -f /etc/logrotate.d/pm2-ottsonly
```

#### 13.5 Optional: Setup External Monitoring

**Install and configure Netdata (System monitoring):**
```bash
# Install Netdata
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# Access at: http://your-vps-ip:19999
# Configure firewall to restrict access
sudo ufw allow from YOUR_IP to any port 19999
```

**Setup UptimeRobot (External monitoring):**
1. Visit https://uptimerobot.com
2. Create free account
3. Add monitors for:
   - https://ottsonly.com
   - https://api.ottsonly.com/health
   - https://admin.ottsonly.com
4. Configure email alerts

---

### Step 14: Backup Strategy (10 minutes)

#### 14.1 Create Backup Script
```bash
mkdir -p /home/ottsonly/backups
nano /home/ottsonly/backups/backup.sh
```

**backup.sh:**
```bash
#!/bin/bash

# Backup script for OTTSONLY
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ottsonly/backups"
PROJECT_DIR="/home/ottsonly/ottsonly-web"

# Create backup directory
mkdir -p "$BACKUP_DIR/daily"

# Backup .env files
echo "Backing up environment files..."
tar -czf "$BACKUP_DIR/daily/env_$DATE.tar.gz" \
    "$PROJECT_DIR/backend/.env" \
    "$PROJECT_DIR/frontend-main/.env" \
    "$PROJECT_DIR/frontend-admin/.env"

# Backup uploads
echo "Backing up uploads..."
if [ -d "$PROJECT_DIR/backend/uploads" ]; then
    tar -czf "$BACKUP_DIR/daily/uploads_$DATE.tar.gz" \
        "$PROJECT_DIR/backend/uploads"
fi

# Backup Nginx configs
echo "Backing up Nginx configuration..."
sudo tar -czf "$BACKUP_DIR/daily/nginx_$DATE.tar.gz" \
    /etc/nginx/sites-available/ottsonly

# Backup PM2 config
echo "Backing up PM2 configuration..."
tar -czf "$BACKUP_DIR/daily/pm2_$DATE.tar.gz" \
    "$PROJECT_DIR/ecosystem.config.js"

# Clean old backups (keep last 7 days)
echo "Cleaning old backups..."
find "$BACKUP_DIR/daily" -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
echo "Backup size: $(du -sh $BACKUP_DIR/daily)"
```

**Make executable:**
```bash
chmod +x /home/ottsonly/backups/backup.sh
```

#### 14.2 Setup Automated Backups
```bash
# Add to crontab
crontab -e

# Add this line (daily at 2 AM):
0 2 * * * /home/ottsonly/backups/backup.sh >> /home/ottsonly/logs/backup.log 2>&1
```

#### 14.3 Test Backup
```bash
# Run backup manually
/home/ottsonly/backups/backup.sh

# Check backup files
ls -lh /home/ottsonly/backups/daily/
```

#### 14.4 MongoDB Atlas Backup
```
MongoDB Atlas automatically backs up your data.
Check backup settings in Atlas dashboard:
1. Login to MongoDB Atlas
2. Go to your cluster
3. Click "Backup" tab
4. Verify "Continuous Backup" is enabled
```

---

## 🐛 COMMON DEPLOYMENT ERRORS & SOLUTIONS

### Error 1: Port 8000 Already in Use
```
ERROR: [Errno 48] Address already in use
```

**Solution:**
```bash
# Find process using port 8000
sudo lsof -i :8000

# Kill the process
sudo kill -9 <PID>

# Or kill all Python processes
pkill -f uvicorn

# Restart with PM2
pm2 restart ottsonly-backend
```

### Error 2: Permission Denied on Uploads Directory
```
ERROR: [Errno 13] Permission denied: '/home/ottsonly/ottsonly-web/backend/uploads'
```

**Solution:**
```bash
# Create uploads directory
mkdir -p /home/ottsonly/ottsonly-web/backend/uploads

# Set correct permissions
chmod 755 /home/ottsonly/ottsonly-web/backend/uploads
chown -R ottsonly:ottsonly /home/ottsonly/ottsonly-web/backend/uploads
```

### Error 3: MongoDB Connection Timeout
```
ERROR: motor.motor_asyncio.AsyncIOMotorClient: timeout
```

**Solution:**
```bash
# Check .env file
cat /home/ottsonly/ottsonly-web/backend/.env | grep MONGODB_URL

# Verify MongoDB Atlas IP whitelist:
# 1. Login to MongoDB Atlas
# 2. Network Access → IP Whitelist
# 3. Add your VPS IP or 0.0.0.0/0 (allow all - less secure)

# Test connection
cd /home/ottsonly/ottsonly-web/backend
source venv/bin/activate
python -c "
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from core.config import settings

async def test():
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
        await client.admin.command('ping')
        print('✅ MongoDB connection successful')
    except Exception as e:
        print(f'❌ MongoDB connection failed: {e}')

asyncio.run(test())
"
```

### Error 4: 502 Bad Gateway from Nginx
```
nginx: 502 Bad Gateway
```

**Solution:**
```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs ottsonly-backend --lines 50

# Check Nginx error log
sudo tail -50 /var/log/nginx/api.ottsonly.error.log

# Common causes:
# 1. Backend not running → pm2 restart ottsonly-backend
# 2. Wrong port in Nginx → check proxy_pass http://127.0.0.1:8000
# 3. Backend crashed → check logs and restart

# Test backend directly
curl http://localhost:8000

# If backend works but Nginx doesn't:
sudo nginx -t
sudo systemctl restart nginx
```

### Error 5: SSL Certificate Error
```
certbot: Error: Unable to find a virtual host listening on port 80
```

**Solution:**
```bash
# Ensure Nginx is configured for port 80
sudo nginx -t

# Stop Nginx before running certbot
sudo systemctl stop nginx

# Run certbot
sudo certbot certonly --standalone -d ottsonly.com -d www.ottsonly.com

# Start Nginx
sudo systemctl start nginx

# Alternative: Use Nginx plugin
sudo certbot --nginx -d ottsonly.com -d www.ottsonly.com
```

### Error 6: Frontend Shows 404 for All Routes
```
React Router routes show 404 after refresh
```

**Solution:**
```bash
# Check Nginx configuration has try_files directive
sudo nano /etc/nginx/sites-available/ottsonly

# Ensure this is present in location / block:
try_files $uri $uri/ /index.html;

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### Error 7: CORS Errors in Browser Console
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
```bash
# Check backend .env has correct URLs
nano /home/ottsonly/ottsonly-web/backend/.env

# Verify:
FRONTEND_URL=https://ottsonly.com
ADMIN_URL=https://admin.ottsonly.com

# Update main.py CORS configuration
nano /home/ottsonly/ottsonly-web/backend/main.py

# Ensure allowed_origins includes production URLs
allowed_origins = [
    settings.FRONTEND_URL,
    settings.ADMIN_URL,
]

# Restart backend
pm2 restart ottsonly-backend

# Clear browser cache and test
```

### Error 8: Payment Verification Failed
```
Razorpay signature verification failed
```

**Solution:**
```bash
# Verify Razorpay keys
cd /home/ottsonly/ottsonly-web/backend
source venv/bin/activate

python -c "
from core.config import settings
print('Key ID:', settings.RAZORPAY_KEY_ID)
print('Key Secret:', settings.RAZORPAY_KEY_SECRET[:10] + '...')
"

# Ensure using LIVE keys for production
# Ensure using TEST keys for testing

# Check webhook signature verification in code
# backend/wallet/service.py should use correct secret

# Test Razorpay connection
python -c "
import razorpay
from core.config import settings
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
print('✅ Razorpay client initialized')
"
```

### Error 9: PM2 Process Keeps Restarting
```
pm2 status shows "errored" or constant restarts
```

**Solution:**
```bash
# Check logs for crash reason
pm2 logs ottsonly-backend --lines 100 --err

# Common issues:
# 1. Import error → check PYTHONPATH in ecosystem.config.js
# 2. Port conflict → check if port 8000 is free
# 3. Missing .env → verify .env file exists

# Test backend manually
cd /home/ottsonly/ottsonly-web/backend
source venv/bin/activate
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# If manual start works, issue is with PM2 config
# Check ecosystem.config.js paths are correct
```

### Error 10: High Memory Usage / OOM Killer
```
Process killed due to out of memory
```

**Solution:**
```bash
# Check current memory usage
free -h
pm2 list

# Reduce Uvicorn workers in ecosystem.config.js
nano /home/ottsonly/ottsonly-web/ecosystem.config.js

# Change from:
args: 'main:app --host 0.0.0.0 --port 8000 --workers 2',

# To:
args: 'main:app --host 0.0.0.0 --port 8000 --workers 1',

# Set memory limit in PM2
pm2 restart ottsonly-backend --max-memory-restart 800M

# Add swap space (if needed)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify swap
free -h
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### 1. Enable HTTP/2 (Already configured in Nginx)
✅ Already done in Nginx config with `http2` directive

### 2. Enable Gzip Compression
```bash
sudo nano /etc/nginx/nginx.conf
```

**Add to http block:**
```nginx
# Gzip Settings
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
```

### 3. Optimize FastAPI Backend
```bash
nano /home/ottsonly/ottsonly-web/backend/main.py
```

**Add caching middleware (optional):**
```python
# Install: pip install fastapi-cache2[redis]
# Configure Redis caching for frequent queries
```

### 4. Database Query Optimization

**Add indexes in MongoDB:**
```bash
cd /home/ottsonly/ottsonly-web/backend
source venv/bin/activate

python -c "
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

async def create_indexes():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    # Users collection indexes
    await db.users.create_index('email', unique=True)
    await db.users.create_index('referral_code', unique=True, sparse=True)
    
    # Orders collection indexes
    await db.orders.create_index('user_id')
    await db.orders.create_index('created_at')
    
    # Products collection indexes
    await db.products.create_index('name')
    await db.products.create_index('is_active')
    
    print('✅ Indexes created successfully')
    client.close()

asyncio.run(create_indexes())
"
```

### 5. Frontend Optimization

**Already built with optimizations:**
- Code splitting ✅
- Minification ✅
- Tree shaking ✅
- Asset optimization ✅

**Additional optimizations:**
```bash
# Build with production mode
cd /home/ottsonly/ottsonly-web/frontend-main
NODE_ENV=production npm run build

# Analyze bundle size
npm run build -- --mode=analyze
```

### 6. CDN Integration (Optional)

**Use Cloudflare CDN:**
1. Sign up at cloudflare.com
2. Add your domain
3. Update nameservers
4. Enable CDN (orange cloud)
5. Configure SSL: Full (strict)
6. Enable "Always Use HTTPS"
7. Enable "Auto Minify" for JS/CSS/HTML

### 7. Redis Caching (Advanced)

**Install Redis:**
```bash
sudo apt install -y redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf

# Set maxmemory
maxmemory 256mb
maxmemory-policy allkeys-lru

# Start Redis
sudo systemctl start redis
sudo systemctl enable redis

# Test
redis-cli ping
# Should return: PONG
```

**Integrate with FastAPI:**
```bash
# Install dependencies
cd /home/ottsonly/ottsonly-web/backend
source venv/bin/activate
pip install redis aioredis
pip freeze > requirements.txt
```

---

## 📊 POST-DEPLOYMENT CHECKLIST

### Security Checklist
- [ ] SSH password authentication disabled
- [ ] Firewall (UFW) configured and enabled
- [ ] Fail2Ban installed and monitoring SSH
- [ ] SSL certificates installed and auto-renewing
- [ ] Admin password changed from default
- [ ] JWT secrets are production-specific
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Razorpay LIVE keys configured (not TEST)
- [ ] .env files not in git repository
- [ ] Nginx security headers configured
- [ ] Rate limiting enabled

### Functionality Checklist
- [ ] Backend API accessible via https://api.ottsonly.com
- [ ] Main frontend accessible via https://ottsonly.com
- [ ] Admin panel accessible via https://admin.ottsonly.com
- [ ] User registration working
- [ ] User login working
- [ ] Product listing working
- [ ] Wallet recharge working (test mode first)
- [ ] Payment verification working
- [ ] Order creation working
- [ ] Referral system working
- [ ] Admin panel login working
- [ ] Admin dashboard functional

### Performance Checklist
- [ ] All pages load in < 3 seconds
- [ ] API responses < 500ms average
- [ ] No console errors in browser
- [ ] Mobile responsive design working
- [ ] Images optimized and loading fast
- [ ] Gzip compression enabled
- [ ] Browser caching configured

### Monitoring Checklist
- [ ] PM2 monitoring backend process
- [ ] Nginx access logs being written
- [ ] Nginx error logs being written
- [ ] PM2 logs being rotated
- [ ] Backup script running daily
- [ ] Uptime monitoring configured (UptimeRobot)
- [ ] SSL expiry monitoring (Let's Encrypt auto-renewal)

### Documentation Checklist
- [ ] Deployment process documented
- [ ] Admin credentials stored securely
- [ ] Database credentials backed up
- [ ] Razorpay keys stored securely
- [ ] Emergency contact list created
- [ ] Rollback procedure documented

---

## 🆘 EMERGENCY PROCEDURES

### Rollback Deployment
```bash
# Stop services
pm2 stop ottsonly-backend

# Pull previous version
cd /home/ottsonly/ottsonly-web
git log --oneline  # Find commit hash
git checkout <previous-commit-hash>

# Rebuild frontend
cd frontend-main && npm run build
cd ../frontend-admin && npm run build

# Restart backend
pm2 restart ottsonly-backend
```

### Emergency Site Down
```bash
# Check all services
sudo systemctl status nginx
pm2 status
sudo systemctl status fail2ban

# Check logs
sudo tail -100 /var/log/nginx/error.log
pm2 logs ottsonly-backend --lines 100

# Restart everything
pm2 restart all
sudo systemctl restart nginx
```

### Database Emergency
```bash
# Restore from MongoDB Atlas:
# 1. Login to Atlas dashboard
# 2. Go to Clusters → your-cluster
# 3. Click "..." → "Restore"
# 4. Choose backup snapshot
# 5. Restore to same cluster

# Or restore specific collection
# Use MongoDB Compass or mongorestore
```

---

## 📞 SUPPORT & MAINTENANCE

### Daily Tasks
- Check PM2 status: `pm2 status`
- Review error logs: `pm2 logs ottsonly-backend --err --lines 50`
- Check disk space: `df -h`
- Monitor transactions in admin panel

### Weekly Tasks
- Review Nginx logs for errors
- Check fail2ban banned IPs: `sudo fail2ban-client status sshd`
- Review system updates: `sudo apt update && sudo apt list --upgradable`
- Test backup restoration
- Review API performance metrics

### Monthly Tasks
- Update system packages: `sudo apt update && sudo apt upgrade`
- Review and rotate JWT secrets
- Security audit
- Performance review
- Cost analysis

### Update Procedure
```bash
# Pull latest code
cd /home/ottsonly/ottsonly-web
git pull origin main

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
pm2 restart ottsonly-backend

# Update frontends
cd ../frontend-main
npm install
npm run build

cd ../frontend-admin
npm install
npm run build

# Clear Nginx cache
sudo nginx -s reload
```

---

## 🎯 FINAL RECOMMENDATIONS

### Before Going Live

1. **Test Everything Twice**
   - Complete user journey testing
   - Payment flow testing with test cards
   - Admin panel full testing
   - Mobile responsive testing

2. **Security Review**
   - Run security scan: `sudo lynis audit system`
   - Check SSL rating: https://www.ssllabs.com/ssltest/
   - Verify no exposed credentials: `grep -r "password" --include="*.py" --include="*.js"`

3. **Performance Testing**
   - Load testing with Apache Bench: `ab -n 1000 -c 10 https://api.ottsonly.com/`
   - Page speed test: https://pagespeed.web.dev/
   - GTmetrix: https://gtmetrix.com/

4. **Documentation**
   - Create runbook for common issues
   - Document all passwords in password manager
   - Create emergency contacts list

5. **Backups**
   - Verify automated backups working
   - Test backup restoration
   - Setup off-site backup (S3, etc.)

### Production Improvements Needed

#### Critical
1. **Add rate limiting middleware** to FastAPI routes
2. **Implement request logging** with structured logs
3. **Add health check endpoint** with database ping
4. **Setup error tracking** (Sentry or similar)
5. **Add API versioning** (/api/v1/)

#### Important
6. **Implement Redis caching** for frequent queries
7. **Add database connection pooling** optimization
8. **Setup CDN** (Cloudflare) for static assets
9. **Add webhook validation** for Razorpay callbacks
10. **Implement API documentation** (Swagger UI is available at /docs)

#### Nice to Have
11. **Add monitoring dashboard** (Grafana + Prometheus)
12. **Setup automated testing** in CI/CD
13. **Add email notifications** for critical events
14. **Implement audit logging** for admin actions
15. **Add database migration tool** (Alembic or similar)

---

## 📚 USEFUL COMMANDS REFERENCE

```bash
# PM2 Commands
pm2 start ecosystem.config.js
pm2 stop ottsonly-backend
pm2 restart ottsonly-backend
pm2 reload ottsonly-backend  # Zero-downtime reload
pm2 logs ottsonly-backend
pm2 monit
pm2 delete ottsonly-backend

# Nginx Commands
sudo nginx -t                    # Test configuration
sudo systemctl restart nginx
sudo systemctl reload nginx      # Reload without downtime
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log

# SSL Commands
sudo certbot renew
sudo certbot certificates
sudo certbot delete --cert-name ottsonly.com

# Firewall Commands
sudo ufw status numbered
sudo ufw allow 80/tcp
sudo ufw deny from 1.2.3.4
sudo ufw delete 3

# Fail2ban Commands
sudo fail2ban-client status
sudo fail2ban-client status sshd
sudo fail2ban-client unban 1.2.3.4

# System Monitoring
htop
df -h
free -h
netstat -tulpn | grep LISTEN
journalctl -u nginx -f
```

---

## ✅ DEPLOYMENT COMPLETE

Your OTTSONLY platform is now deployed and ready for production!

**Access URLs:**
- Main Site: https://ottsonly.com
- Admin Panel: https://admin.ottsonly.com
- API Docs: https://api.ottsonly.com/docs

**Next Steps:**
1. Change all default passwords
2. Test entire user flow
3. Enable monitoring
4. Start with test transactions
5. Switch to live Razorpay keys after testing
6. Monitor logs for first 24 hours

**Emergency Contacts:**
- Server Admin: ottsonly@your-email.com
- Developer: your-email@domain.com
- MongoDB Atlas Support: https://support.mongodb.com
- Razorpay Support: https://razorpay.com/support/

---

*Last Updated: December 22, 2025*
*Deployment Guide Version: 1.0.0*
