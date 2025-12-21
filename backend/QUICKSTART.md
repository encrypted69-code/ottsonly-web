# OTTSONLY Backend - Quick Start Guide

## Prerequisites
- Python 3.11+
- MongoDB installed and running
- Razorpay account (for payment integration)
- Telegram Bot Token (optional, for admin notifications)

## Quick Setup

### 1. Install Dependencies
```powershell
cd backend
pip install -r requirements.txt
```

### 2. Start MongoDB
```powershell
# Windows
net start MongoDB

# Or if MongoDB is not a service, start manually:
mongod --dbpath="C:\data\db"
```

### 3. Configure Environment
Edit `.env` file and update:
- `SECRET_KEY` - Change to a secure random string (32+ chars)
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` - Your Razorpay credentials
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ADMIN_CHAT_ID` - Optional, for notifications

### 4. Run the Application
```powershell
python main.py
```

The server will start at: http://localhost:8000

## First Steps

### 1. Access API Documentation
Open your browser: http://localhost:8000/docs

### 2. Create First User (Admin)

**Login:**
```powershell
curl -X POST http://localhost:8000/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"phone\": \"+919876543210\"}'
```

**Verify OTP (use 123456 in dev mode):**
```powershell
curl -X POST http://localhost:8000/auth/verify `
  -H "Content-Type: application/json" `
  -d '{\"phone\": \"+919876543210\", \"otp\": \"123456\"}'
```

Save the `access_token` from response.

### 3. Make User Admin

Connect to MongoDB and update user role:
```javascript
// In MongoDB Shell or MongoDB Compass
use ottsonly_db
db.users.updateOne(
  {phone: "+919876543210"},
  {$set: {role: "admin"}}
)
```

### 4. Create First Product

```powershell
curl -X POST http://localhost:8000/products/ `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{
    \"platform_name\": \"Netflix\",
    \"plan_name\": \"Premium 4K\",
    \"price\": 649.0,
    \"duration_days\": 30,
    \"stock\": 50,
    \"is_active\": true,
    \"description\": \"Ultra HD streaming on 4 devices\"
  }'
```

### 5. Test Complete Flow

1. **Add money to wallet** (in production, this uses Razorpay)
2. **Browse products**: http://localhost:8000/products/
3. **Create order**: POST to /orders/
4. **Check subscription**: GET /subscriptions/my-subscriptions
5. **Admin assigns credentials**: POST /subscriptions/{id}/assign-credentials

## API Endpoints Quick Reference

### Authentication
- POST `/auth/login` - Send OTP
- POST `/auth/verify` - Verify OTP, get token
- GET `/auth/me` - Get profile

### Products
- GET `/products/` - List products (public)
- POST `/products/` - Create product (admin)
- PATCH `/products/{id}` - Update product (admin)

### Orders
- POST `/orders/` - Create order
- GET `/orders/my-orders` - My orders
- POST `/orders/{id}/refund` - Refund (admin)

### Wallet
- GET `/wallet/balance` - Get balance
- POST `/wallet/add-money` - Add money
- GET `/wallet/transactions` - Transaction history

### Subscriptions
- GET `/subscriptions/my-subscriptions` - My subscriptions
- POST `/subscriptions/{id}/assign-credentials` - Assign credentials (admin)

## Testing with Swagger UI

1. Open http://localhost:8000/docs
2. Click "Authorize" button
3. Enter: `Bearer YOUR_ACCESS_TOKEN`
4. Now you can test all endpoints directly from browser

## Troubleshooting

### MongoDB Connection Failed
- Check if MongoDB service is running
- Verify `MONGODB_URL` in `.env`

### Authentication Error
- Check if token is expired (7 days by default)
- Verify Authorization header format: `Bearer <token>`

### Import Errors
- Ensure all `__init__.py` files are present
- Run from backend directory: `python main.py`

## Production Deployment

1. Set `DEBUG=False` in `.env`
2. Change `SECRET_KEY` to a secure random value
3. Use proper MongoDB authentication
4. Configure CORS origins in `main.py`
5. Use HTTPS/SSL
6. Set up rate limiting
7. Enable MongoDB backups

## Support

For detailed documentation, see [README.md](README.md)

---

**Happy Coding! 🚀**
