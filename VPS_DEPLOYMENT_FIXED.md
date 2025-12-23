# 🚀 VPS Deployment Guide for OTTSONLY

## Issues Fixed

✅ **Frontend API configuration** - Now uses environment variables  
✅ **Backend CORS** - Added ottsonly.in to allowed origins  
✅ **Nginx configuration** - Created reverse proxy setup  
✅ **Environment files** - Updated with production URLs  

---

## Quick Deployment Steps

### 1. Push Changes to GitHub

```bash
# In your local project
git add .
git commit -m "Fix production configuration for VPS deployment"
git push origin main
```

### 2. Pull Changes on VPS

```bash
# SSH into your VPS
ssh user@ottsonly.in

# Navigate to your project
cd /var/www/ottsonly

# Pull latest changes
git pull origin main
```

### 3. Setup Backend

```bash
# Navigate to backend
cd /var/www/ottsonly/backend

# Create production .env file
cp .env.example .env
nano .env
```

**Important .env values to configure:**
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?appName=ottsonly
SECRET_KEY=<generate-random-64-char-string>
REFRESH_SECRET_KEY=<generate-different-random-64-char-string>
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret_here
FRONTEND_URL=https://ottsonly.in
ADMIN_URL=https://ottsonly.in/admin
SUPER_ADMIN_EMAIL=admin@ottsonly.in
SUPER_ADMIN_PASSWORD=<strong-password>
DEBUG=False
ENVIRONMENT=production
```

**Generate secure keys:**
```bash
# Generate SECRET_KEY
python3 -c "import secrets; print(secrets.token_urlsafe(64))"

# Generate REFRESH_SECRET_KEY
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

**Install dependencies & start backend:**
```bash
# Install Python packages
pip3 install -r requirements.txt

# Create systemd service
sudo nano /etc/systemd/system/ottsonly-backend.service
```

**Add this to the service file:**
```ini
[Unit]
Description=OTTSONLY FastAPI Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/ottsonly/backend
Environment="PATH=/usr/local/bin:/usr/bin:/bin"
ExecStart=/usr/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Enable and start service:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable ottsonly-backend
sudo systemctl start ottsonly-backend
sudo systemctl status ottsonly-backend
```

### 4. Setup Frontend (Main)

```bash
cd /var/www/ottsonly/frontend-main

# Create .env file
cp .env.example .env
nano .env
```

**Add to .env:**
```env
VITE_API_URL=https://ottsonly.in/api
```

**Build frontend:**
```bash
npm install
npm run build
```

### 5. Setup Frontend (Admin)

```bash
cd /var/www/ottsonly/frontend-admin

# Create .env file
cp .env.example .env
nano .env
```

**Add to .env:**
```env
VITE_API_URL=https://ottsonly.in/api
```

**Build admin:**
```bash
npm install
npm run build
```

### 6. Setup Nginx

```bash
# Copy nginx config
sudo cp /var/www/ottsonly/nginx.conf /etc/nginx/sites-available/ottsonly.in

# Create symlink
sudo ln -s /etc/nginx/sites-available/ottsonly.in /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### 7. Setup SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d ottsonly.in -d www.ottsonly.in

# Test auto-renewal
sudo certbot renew --dry-run
```

### 8. Initialize Database

```bash
cd /var/www/ottsonly/backend

# Create admin user
python3 seed_admin.py

# (Optional) Add demo products
python3 create_demo_products.py
```

---

## Verification Checklist

✅ Backend is running: `sudo systemctl status ottsonly-backend`  
✅ Nginx is running: `sudo systemctl status nginx`  
✅ API accessible: `curl https://ottsonly.in/api/`  
✅ Frontend loads: Visit `https://ottsonly.in`  
✅ Admin panel loads: Visit `https://ottsonly.in/admin`  
✅ SSL certificate valid: Check browser padlock  

---

## Test API Endpoints

```bash
# Health check
curl https://ottsonly.in/api/

# Products list
curl https://ottsonly.in/api/products/

# Admin login (from browser console or Postman)
curl -X POST https://ottsonly.in/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ottsonly.in","password":"your-password"}'
```

---

## Troubleshooting

### Backend not starting
```bash
# Check logs
sudo journalctl -u ottsonly-backend -f

# Common fixes:
# 1. Check .env file exists and has correct values
# 2. Check MongoDB connection string
# 3. Ensure all dependencies installed
```

### Frontend shows blank page
```bash
# Check nginx error logs
sudo tail -f /var/log/nginx/ottsonly_error.log

# Rebuild frontend
cd /var/www/ottsonly/frontend-main
npm run build
```

### API not accessible
```bash
# Check if backend is running
sudo systemctl status ottsonly-backend

# Check backend logs
sudo journalctl -u ottsonly-backend -n 50

# Check nginx config
sudo nginx -t
```

### CORS errors in browser
- Verify FRONTEND_URL in backend/.env matches your domain
- Check backend/main.py has ottsonly.in in allowed_origins
- Clear browser cache and try again

---

## File Permissions

```bash
# Set correct ownership
sudo chown -R www-data:www-data /var/www/ottsonly

# Backend uploads directory
sudo chmod -R 755 /var/www/ottsonly/backend/uploads
```

---

## Monitoring

```bash
# Watch backend logs
sudo journalctl -u ottsonly-backend -f

# Watch nginx access logs
sudo tail -f /var/log/nginx/ottsonly_access.log

# Watch nginx error logs
sudo tail -f /var/log/nginx/ottsonly_error.log

# Check system resources
htop
```

---

## Updates & Maintenance

### Deploy new changes:
```bash
cd /var/www/ottsonly
git pull origin main

# Rebuild frontends if needed
cd frontend-main && npm run build
cd ../frontend-admin && npm run build

# Restart backend
sudo systemctl restart ottsonly-backend

# Reload nginx
sudo systemctl reload nginx
```

### Backup MongoDB:
```bash
# Your MongoDB Atlas has automatic backups
# Or create manual backup:
mongodump --uri="your-mongodb-connection-string" --out=/backups/ottsonly-$(date +%Y%m%d)
```

---

## Security Best Practices

✅ Use strong passwords for admin and database  
✅ Keep SECRET_KEY and REFRESH_SECRET_KEY private  
✅ Never commit .env files to git  
✅ Use HTTPS only (HTTP redirects to HTTPS)  
✅ Keep system and dependencies updated  
✅ Monitor logs regularly for suspicious activity  
✅ Use firewall (UFW) to restrict ports  

```bash
# Configure firewall
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## Support

If issues persist after following this guide:

1. Check all configuration files match the examples
2. Verify environment variables are set correctly
3. Ensure MongoDB connection is working
4. Check system logs for specific errors
5. Verify SSL certificate is valid

---

## Next Steps

1. ✅ Test all user flows (register, login, purchase)
2. ✅ Test admin panel functionality
3. ✅ Setup payment gateway (Razorpay) with live keys
4. ✅ Configure Telegram bot notifications
5. ✅ Setup monitoring (optional: Uptime Robot, New Relic)
6. ✅ Configure automated backups
7. ✅ Add custom domain email (optional)
