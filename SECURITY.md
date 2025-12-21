# OTTSONLY - Security & Deployment Guide

## ⚠️ CRITICAL: Before Deploying to Production

### 1. Environment Variables Setup

**NEVER commit `.env` files to version control!**

#### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your actual credentials
```

Required variables:
- `MONGODB_URL` - Your MongoDB Atlas connection string
- `SECRET_KEY` - Generate with: `openssl rand -hex 32`
- `REFRESH_SECRET_KEY` - Generate with: `openssl rand -hex 32`
- `SUPER_ADMIN_EMAIL` - Your admin email
- `SUPER_ADMIN_PASSWORD` - Strong password (min 12 chars)
- `RAZORPAY_KEY_ID` - Get from Razorpay Dashboard
- `RAZORPAY_KEY_SECRET` - Get from Razorpay Dashboard

#### Frontend Setup
```bash
cd frontend-main
cp .env.example .env
# Add your API keys if needed

cd ../frontend-admin
cp .env.example .env
# Add your API keys if needed
```

### 2. Security Checklist

- [ ] All `.env` files are in `.gitignore`
- [ ] No hardcoded credentials in code
- [ ] Admin password changed from default
- [ ] JWT secrets are random and unique
- [ ] Razorpay keys are LIVE mode for production
- [ ] MongoDB IP whitelist configured
- [ ] CORS origins set to production domains
- [ ] Rate limiting enabled
- [ ] HTTPS enforced in production

### 3. Razorpay Security

**Test Mode vs Live Mode:**
- Development: Use `rzp_test_` keys
- Production: Use `rzp_live_` keys

**Key Security:**
- Never expose `RAZORPAY_KEY_SECRET` to frontend
- Always verify webhook signatures
- Use HMAC-SHA256 for payment verification

### 4. MongoDB Security

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/?appName=ottsonly
```

**Best Practices:**
- Create separate users for dev/prod
- Use IP whitelist in Atlas
- Enable audit logging
- Regular backups

### 5. Admin Account Security

**Default Credentials (CHANGE IMMEDIATELY):**
- Email: From `SUPER_ADMIN_EMAIL` in .env
- Password: From `SUPER_ADMIN_PASSWORD` in .env

**Password Requirements:**
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Not related to domain name
- Changed regularly

### 6. JWT Token Security

**Current Configuration:**
- Algorithm: HS256
- Access Token: 7 days (10080 minutes)
- Refresh Token: 7 days

**Production Recommendations:**
- Keep secrets long (64+ characters)
- Rotate secrets periodically
- Use shorter token expiry for sensitive operations

### 7. CORS Configuration

**Development:**
```python
FRONTEND_URL=http://localhost:4028
ADMIN_URL=http://localhost:3001
```

**Production:**
```python
FRONTEND_URL=https://ottsonly.com
ADMIN_URL=https://admin.ottsonly.com
```

### 8. Rate Limiting

Current: 60 requests per minute per IP

Adjust in `.env`:
```
RATE_LIMIT_PER_MINUTE=100
```

### 9. Deployment Steps

#### First Time Deployment

1. **Initialize Git Repository:**
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Verify No Secrets:**
```bash
git log --all --full-history -- "*/.env"
# Should return empty
```

3. **Push to GitHub:**
```bash
git remote add origin https://github.com/yourusername/ottsonly.git
git branch -M main
git push -u origin main
```

#### Production Environment Variables

Set these on your hosting platform (Railway, Render, etc.):
- All variables from `backend/.env.example`
- Set `ENVIRONMENT=production`
- Set `DEBUG=False`
- Update `FRONTEND_URL` and `ADMIN_URL` to production domains

### 10. Monitoring & Logging

**Log Levels:**
- Development: DEBUG
- Production: INFO or WARNING

**What to Log:**
- Failed login attempts
- Payment transactions
- API errors
- Rate limit violations

**What NOT to Log:**
- Passwords (even hashed)
- JWT tokens
- Payment card details
- API keys

### 11. Regular Security Tasks

**Monthly:**
- Review user activity logs
- Check for suspicious transactions
- Update dependencies
- Review API access patterns

**Quarterly:**
- Rotate JWT secrets
- Review admin access
- Security audit of codebase
- Update SSL certificates

**Annually:**
- Change admin password
- Rotate Razorpay keys
- Full security penetration test
- Review and update security policies

### 12. Emergency Response

**If Credentials Compromised:**

1. **Immediately:**
   - Revoke compromised API keys
   - Change admin password
   - Rotate JWT secrets
   - Force logout all users

2. **Within 1 Hour:**
   - Review transaction logs
   - Check for unauthorized access
   - Notify affected users
   - Report to payment provider

3. **Within 24 Hours:**
   - Full security audit
   - Update all credentials
   - Deploy security patches
   - Document incident

### 13. Contact

**Security Issues:** security@ottsonly.in  
**Support:** support@ottsonly.in

---

## 🔒 Remember

> "Security is not a product, but a process" - Bruce Schneier

Never skip security checks. Always assume your credentials can be compromised.
