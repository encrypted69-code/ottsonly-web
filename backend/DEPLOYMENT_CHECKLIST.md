# 🚀 OTTSONLY Backend - Production Deployment Checklist

Use this checklist before deploying to production.

## 🔒 Security

- [ ] Change `SECRET_KEY` in `.env` to a strong random value (32+ characters)
  ```bash
  # Generate a secure key:
  python -c "import secrets; print(secrets.token_urlsafe(32))"
  ```

- [ ] Set `DEBUG=False` in `.env`

- [ ] Update CORS origins in `main.py` to only allow your frontend domain
  ```python
  allow_origins=["https://yourdomain.com"]
  ```

- [ ] Enable MongoDB authentication
  ```
  MONGODB_URL=mongodb://username:password@host:port/database
  ```

- [ ] Store `.env` file securely (never commit to Git)

- [ ] Use environment variables for all sensitive data

- [ ] Set up HTTPS/SSL certificates

- [ ] Configure firewall rules

## 🗄️ Database

- [ ] Set up MongoDB with authentication enabled

- [ ] Configure database backups (daily recommended)

- [ ] Create indexes for performance:
  ```javascript
  db.users.createIndex({ phone: 1 }, { unique: true })
  db.products.createIndex({ is_active: 1 })
  db.orders.createIndex({ user_id: 1, created_at: -1 })
  db.subscriptions.createIndex({ user_id: 1, status: 1 })
  db.wallet_transactions.createIndex({ user_id: 1, created_at: -1 })
  db.notifications.createIndex({ user_id: 1, is_read: 1 })
  ```

- [ ] Set up MongoDB monitoring

- [ ] Configure connection pooling

- [ ] Test database connection timeout handling

## 💳 Payment Integration

- [ ] Use production Razorpay credentials
  - [ ] Update `RAZORPAY_KEY_ID`
  - [ ] Update `RAZORPAY_KEY_SECRET`

- [ ] Test payment flow end-to-end

- [ ] Set up payment webhooks for automatic verification

- [ ] Configure payment failure handling

- [ ] Test refund processing

## 🤖 Telegram Bot

- [ ] Create production Telegram bot with @BotFather

- [ ] Update `TELEGRAM_BOT_TOKEN`

- [ ] Update `TELEGRAM_ADMIN_CHAT_ID`

- [ ] Test all notification types

- [ ] Set up bot commands (optional)

## 📱 SMS/OTP

- [ ] Replace mock OTP with real SMS gateway
  - Options: Twilio, MSG91, AWS SNS, etc.

- [ ] Implement OTP expiry (5-10 minutes)

- [ ] Add rate limiting for OTP requests

- [ ] Implement OTP retry logic

- [ ] Add OTP verification cooldown

## 🎯 Performance

- [ ] Use gunicorn with multiple workers
  ```bash
  gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
  ```

- [ ] Set up Redis for caching (optional)

- [ ] Configure database connection pooling

- [ ] Enable response compression

- [ ] Set up CDN for static files (if any)

- [ ] Monitor API response times

## 🛡️ Rate Limiting

- [ ] Install rate limiting middleware
  ```bash
  pip install slowapi
  ```

- [ ] Add rate limits to critical endpoints:
  - Login: 5 requests/minute
  - OTP verification: 3 requests/minute
  - Create order: 10 requests/minute

- [ ] Implement IP-based rate limiting

## 📊 Monitoring & Logging

- [ ] Set up application logging
  ```python
  import logging
  logging.basicConfig(level=logging.INFO)
  ```

- [ ] Configure log rotation

- [ ] Set up error tracking (Sentry, Rollbar, etc.)

- [ ] Monitor server metrics (CPU, RAM, disk)

- [ ] Set up API endpoint monitoring

- [ ] Configure alerts for critical errors

- [ ] Track key business metrics

## 🔄 Backup & Recovery

- [ ] Automated database backups

- [ ] Test backup restoration process

- [ ] Set up off-site backup storage

- [ ] Document recovery procedures

- [ ] Test disaster recovery plan

## 🌐 Infrastructure

- [ ] Set up reverse proxy (Nginx/Apache)
  ```nginx
  server {
      listen 80;
      server_name api.ottsonly.com;
      
      location / {
          proxy_pass http://localhost:8000;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
      }
  }
  ```

- [ ] Configure SSL/TLS certificates (Let's Encrypt)

- [ ] Set up load balancer (if using multiple servers)

- [ ] Configure auto-scaling (cloud deployments)

- [ ] Set up health check endpoints

## 📝 Documentation

- [ ] Update API documentation

- [ ] Document deployment process

- [ ] Create runbook for common issues

- [ ] Document backup/restore procedures

- [ ] Create admin user guide

## 🧪 Testing

- [ ] Run all endpoint tests

- [ ] Test error scenarios

- [ ] Load test critical endpoints

- [ ] Test payment integration end-to-end

- [ ] Verify all admin functions

- [ ] Test role-based access control

## 🔐 Access Control

- [ ] Create admin users manually

- [ ] Document admin user creation process

- [ ] Set up multi-factor authentication (if needed)

- [ ] Implement password policy (if adding passwords)

- [ ] Regular security audits

## 📱 Application Config

### Update `.env` for Production:
```env
# Application
APP_NAME=OTTSONLY
DEBUG=False

# MongoDB
MONGODB_URL=mongodb://username:password@production-host:27017
DATABASE_NAME=ottsonly_production

# JWT
SECRET_KEY=<GENERATE_SECURE_32_CHAR_KEY>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Razorpay (Production)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_production_secret

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_production_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_admin_chat_id

# OTP - Remove mock OTP in production
# Integrate with SMS gateway
```

## 🚀 Deployment Steps

### Option 1: Traditional Server

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up systemd service:**
   ```bash
   sudo nano /etc/systemd/system/ottsonly.service
   ```
   
   ```ini
   [Unit]
   Description=OTTSONLY FastAPI Backend
   After=network.target

   [Service]
   User=www-data
   WorkingDirectory=/var/www/ottsonly/backend
   ExecStart=/usr/local/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

3. **Enable and start:**
   ```bash
   sudo systemctl enable ottsonly
   sudo systemctl start ottsonly
   ```

### Option 2: Docker

1. **Create Dockerfile:**
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
   ```

2. **Build and run:**
   ```bash
   docker build -t ottsonly-backend .
   docker run -p 8000:8000 --env-file .env ottsonly-backend
   ```

### Option 3: Cloud Platforms

**Railway:**
- Connect GitHub repo
- Add environment variables
- Deploy automatically

**Render:**
- Connect GitHub repo
- Set build command: `pip install -r requirements.txt`
- Set start command: `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`

**AWS/GCP/Azure:**
- Use EC2/Compute Engine/VM
- Follow Option 1 (Traditional Server)

## ✅ Pre-Launch Checklist

- [ ] All security measures implemented
- [ ] Database backups configured
- [ ] Monitoring and alerts set up
- [ ] SSL certificates installed
- [ ] Payment gateway tested
- [ ] All endpoints tested
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Admin users created
- [ ] Emergency contacts documented

## 🎉 Post-Deployment

- [ ] Monitor error logs for 24 hours
- [ ] Check performance metrics
- [ ] Test critical flows
- [ ] Monitor payment transactions
- [ ] Check Telegram notifications
- [ ] Verify backup process
- [ ] Test disaster recovery

## 📞 Support

Keep these handy:
- MongoDB support contact
- Razorpay support contact
- SMS gateway support
- Hosting provider support
- Team on-call schedule

---

**Good luck with your deployment! 🚀**
