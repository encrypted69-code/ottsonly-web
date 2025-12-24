# 🚀 Quick VPS Deployment Guide

## VPS Details
- **IP:** 159.195.84.250
- **Username:** root
- **Password:** fwL7SSAu0BMLuna
- **Port:** 22
- **RAM:** 8 GB, 4 cores

## 📦 Prerequisites

Your GitHub repository: https://github.com/encrypted69-code/ottsonly-web

---

## 🔥 QUICK START - Run These Commands on VPS

### Step 1: Connect to VPS

```bash
ssh root@159.195.84.250
```
Password: `fwL7SSAu0BMLuna`

### Step 2: Download and Run Deployment Script

```bash
# Update system
apt update && apt upgrade -y

# Clone your repository
cd /var/www
git clone https://github.com/encrypted69-code/ottsonly-web.git ottsonly
cd ottsonly

# Make deployment script executable
chmod +x deploy-to-vps.sh

# Run deployment
./deploy-to-vps.sh
```

**The script will automatically:**
- Install all dependencies (Python, Node.js, Nginx)
- Setup backend with virtual environment
- Build both frontends
- Configure Nginx
- Create systemd service
- Start all services

---

## ⚙️ Manual Configuration Required

### 1. Edit Backend Environment Variables

After the script completes, edit the backend `.env` file:

```bash
nano /var/www/ottsonly/backend/.env
```

**Update these values:**

```env
# MongoDB - Use your actual MongoDB connection string
MONGODB_URL=mongodb+srv://ivhgin_db_user:Aditi733202@ottsonly.gautzky.mongodb.net/?appName=ottsonly

# Generate new secure keys (run these commands)
# python3 -c "import secrets; print(secrets.token_urlsafe(64))"
SECRET_KEY=<paste-generated-key-here>
REFRESH_SECRET_KEY=<paste-different-generated-key-here>

# Change admin password
SUPER_ADMIN_PASSWORD=YourSecurePassword123!

# Production URLs
FRONTEND_URL=https://ottsonly.in
ADMIN_URL=https://ottsonly.in/admin

# Razorpay credentials
RAZORPAY_KEY_ID=rzp_live_Rr2QpjVo01kSVS
RAZORPAY_KEY_SECRET=z6CHXmDiHRa0uYKGx5DJ5T4c
```

**Generate secure keys:**
```bash
cd /var/www/ottsonly/backend
source venv/bin/activate
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(64))"
python3 -c "import secrets; print('REFRESH_SECRET_KEY=' + secrets.token_urlsafe(64))"
```

Save file: `Ctrl+X`, then `Y`, then `Enter`

### 2. Restart Backend Service

```bash
sudo systemctl restart ottsonly-backend
```

### 3. Check if Services are Running

```bash
# Check backend status
sudo systemctl status ottsonly-backend

# Check nginx status
sudo systemctl status nginx

# View backend logs
sudo journalctl -u ottsonly-backend -f
```

---

## 🌐 DNS Configuration

Point your domain to the VPS:

1. Go to your domain registrar (Namecheap, GoDaddy, etc.)
2. Add these DNS records:

```
Type: A
Host: @
Value: 159.195.84.250
TTL: 3600

Type: A
Host: www
Value: 159.195.84.250
TTL: 3600
```

Wait 5-30 minutes for DNS propagation.

---

## 🔒 Install SSL Certificate (After DNS Setup)

Once DNS is pointing to your VPS:

```bash
# Install SSL certificate
sudo certbot --nginx -d ottsonly.in -d www.ottsonly.in

# Follow prompts:
# - Enter your email
# - Agree to terms
# - Choose option 2 (redirect HTTP to HTTPS)

# Enable auto-renewal
sudo systemctl enable certbot.timer
```

---

## ✅ Verify Deployment

1. **Check if backend is running:**
   ```bash
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"healthy","app":"OTTSONLY"}`

2. **Check if frontend is accessible:**
   - Open browser: `http://159.195.84.250`
   - After DNS + SSL: `https://ottsonly.in`

3. **Check admin panel:**
   - `http://159.195.84.250/admin`
   - After DNS + SSL: `https://ottsonly.in/admin`

---

## 📊 Useful Commands

### Service Management
```bash
# Restart backend
sudo systemctl restart ottsonly-backend

# Stop backend
sudo systemctl stop ottsonly-backend

# Start backend
sudo systemctl start ottsonly-backend

# View backend logs (live)
sudo journalctl -u ottsonly-backend -f

# View last 100 lines of logs
sudo journalctl -u ottsonly-backend -n 100

# Restart Nginx
sudo systemctl restart nginx
```

### Update Application
```bash
cd /var/www/ottsonly
git pull origin main

# Rebuild frontends
cd frontend-main && npm run build
cd ../frontend-admin && npm run build

# Restart backend
sudo systemctl restart ottsonly-backend

# Restart nginx
sudo systemctl restart nginx
```

### Database Seeding
```bash
cd /var/www/ottsonly/backend
source venv/bin/activate

# Create admin user
python3 seed_admin.py

# Create demo products
python3 create_demo_products.py
```

---

## 🐛 Troubleshooting

### Backend not starting
```bash
# Check logs
sudo journalctl -u ottsonly-backend -n 50

# Common issues:
# 1. MongoDB connection failed - check MONGODB_URL in .env
# 2. Port already in use - check if another service is using port 8000
```

### Frontend showing errors
```bash
# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check if backend is running
curl http://localhost:8000/health

# Rebuild frontend
cd /var/www/ottsonly/frontend-main
npm run build
```

### 502 Bad Gateway
```bash
# Backend is not running or not responding
sudo systemctl status ottsonly-backend
sudo systemctl restart ottsonly-backend
```

### Database Connection Error
```bash
# Test MongoDB connection
cd /var/www/ottsonly/backend
source venv/bin/activate
python3 -c "from core.database import connect_to_mongo; import asyncio; asyncio.run(connect_to_mongo())"
```

---

## 🔥 Security Checklist

- [x] Firewall configured (UFW)
- [ ] Change root password
- [ ] Create non-root sudo user
- [ ] Disable root SSH login
- [ ] Setup fail2ban
- [ ] Enable automatic security updates
- [ ] Setup backups
- [ ] Configure monitoring

---

## 📞 Support

If you encounter issues:
1. Check logs: `sudo journalctl -u ottsonly-backend -f`
2. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify .env configuration
4. Check MongoDB connection
5. Ensure DNS is properly configured

---

## 🎉 Success!

Your application should now be running:
- Main site: https://ottsonly.in
- Admin panel: https://ottsonly.in/admin
- API: https://ottsonly.in/api/health

Login with:
- Email: admin@ottsonly.in
- Password: (the one you set in .env)
