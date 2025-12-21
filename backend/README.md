# OTTSONLY Backend

Production-ready backend for OTT subscription platform built with FastAPI, MongoDB, JWT authentication, Razorpay payment integration, and Telegram bot notifications.

## Features

### 🔐 Authentication
- Phone number + OTP login
- JWT token-based authentication
- Role-based access control (user, admin, support)
- Secure password-less authentication

### 👥 User Management
- Auto-create users on first login
- Profile management
- Wallet integration
- Role-based permissions

### 📦 Products (OTT Plans)
- CRUD operations for OTT plans
- Stock management
- Platform categorization (Netflix, Prime, etc.)
- Active/Inactive status
- Admin-only management

### 🛒 Orders
- Create orders with wallet payment
- Automatic stock deduction
- Order status tracking
- Admin refund capability
- Automatic subscription creation

### 📺 Subscriptions
- Automatic activation on payment
- Subscription lifecycle management
- Admin assigns OTT credentials
- Expiry tracking
- Status: active, expired, cancelled

### 💰 Wallet System
- Ledger-based transaction system
- Razorpay payment integration
- Add money to wallet
- Payment verification
- Admin manual credit/debit
- Complete transaction history

### 🔔 Notifications
- In-app notification system
- Read/unread status
- Bulk notifications (admin)
- Notification history

### 🤖 Telegram Bot
- Admin notifications for:
  - New orders
  - Payment success
  - Subscription activation
  - Refunds issued
  - Wallet recharges

## Tech Stack

- **Python 3.11+**
- **FastAPI** - Modern async web framework
- **MongoDB** - NoSQL database with Motor async driver
- **JWT** - Token-based authentication
- **Razorpay** - Payment gateway integration
- **Telegram Bot** - Admin notifications
- **Pydantic** - Data validation

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── core/
│   ├── config.py          # Configuration and settings
│   ├── database.py        # MongoDB connection management
│   └── security.py        # JWT and authentication utilities
├── auth/
│   ├── routes.py          # Authentication endpoints
│   ├── schemas.py         # Pydantic models for auth
│   └── service.py         # Authentication business logic
├── users/
│   ├── routes.py          # User management endpoints
│   ├── schemas.py         # User models
│   └── service.py         # User business logic
├── products/
│   ├── routes.py          # Product/Plan endpoints
│   ├── schemas.py         # Product models
│   └── service.py         # Product business logic
├── orders/
│   ├── routes.py          # Order endpoints
│   ├── schemas.py         # Order models
│   └── service.py         # Order processing logic
├── subscriptions/
│   ├── routes.py          # Subscription endpoints
│   ├── schemas.py         # Subscription models
│   └── service.py         # Subscription management
├── wallet/
│   ├── routes.py          # Wallet endpoints
│   ├── schemas.py         # Wallet models
│   └── service.py         # Wallet and payment logic
├── notifications/
│   ├── routes.py          # Notification endpoints
│   ├── schemas.py         # Notification models
│   └── service.py         # Notification management
├── bots/
│   └── telegram.py        # Telegram bot integration
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
└── README.md             # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Edit the `.env` file with your settings:

```env
# Application
APP_NAME=OTTSONLY
DEBUG=True

# MongoDB
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=ottsonly_db

# JWT
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_admin_chat_id

# OTP
MOCK_OTP=123456
```

### 3. Install and Start MongoDB

**Windows:**
```bash
# Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
# Start MongoDB service
net start MongoDB
```

**Linux/Mac:**
```bash
# Install MongoDB
sudo apt-get install mongodb-org  # Ubuntu/Debian
brew install mongodb-community     # macOS

# Start MongoDB
sudo systemctl start mongod        # Linux
brew services start mongodb-community  # macOS
```

### 4. Run the Application

```bash
# Development mode with auto-reload
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Documentation

### Authentication Endpoints

#### POST `/auth/login`
Initiate login with phone number (sends OTP)

**Request:**
```json
{
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "phone": "+919876543210",
  "otp": "123456"
}
```

#### POST `/auth/verify`
Verify OTP and get JWT token

**Request:**
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "phone": "+919876543210",
    "role": "user",
    "wallet_balance": 0.0
  }
}
```

#### GET `/auth/me`
Get current user profile (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

### User Endpoints

- `GET /users/me` - Get my profile
- `PATCH /users/me` - Update my profile
- `GET /users/` - List all users (admin only)
- `GET /users/{user_id}` - Get user by ID (admin/support)

### Product Endpoints

- `GET /products/` - List all products (public)
- `GET /products/{product_id}` - Get product details
- `POST /products/` - Create product (admin only)
- `PATCH /products/{product_id}` - Update product (admin only)
- `DELETE /products/{product_id}` - Delete product (admin only)

### Order Endpoints

- `POST /orders/` - Create order and process payment
- `GET /orders/my-orders` - Get my orders
- `GET /orders/` - List all orders (admin only)
- `GET /orders/{order_id}` - Get order details
- `POST /orders/{order_id}/refund` - Refund order (admin only)

### Subscription Endpoints

- `GET /subscriptions/my-subscriptions` - Get my subscriptions
- `GET /subscriptions/` - List all subscriptions (admin only)
- `GET /subscriptions/{subscription_id}` - Get subscription details
- `POST /subscriptions/{subscription_id}/assign-credentials` - Assign OTT credentials (admin only)
- `POST /subscriptions/{subscription_id}/cancel` - Cancel subscription (admin only)

### Wallet Endpoints

- `GET /wallet/balance` - Get wallet balance
- `POST /wallet/add-money` - Initiate add money (creates Razorpay order)
- `POST /wallet/verify-payment` - Verify payment and credit wallet
- `GET /wallet/transactions` - Get transaction history
- `POST /wallet/admin-operation` - Admin credit/debit (admin only)

### Notification Endpoints

- `GET /notifications/` - Get my notifications
- `GET /notifications/unread-count` - Get unread count
- `POST /notifications/{notification_id}/read` - Mark as read
- `POST /notifications/mark-all-read` - Mark all as read
- `DELETE /notifications/{notification_id}` - Delete notification
- `POST /notifications/bulk` - Send bulk notification (admin only)

## Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Role-Based Access

- **user**: Default role, can purchase plans and manage own account
- **support**: Can view users and subscriptions
- **admin**: Full access to all endpoints and operations

## Development Workflow

### 1. Test Authentication
```bash
# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# Verify OTP
curl -X POST http://localhost:8000/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "otp": "123456"}'
```

### 2. Create Products (Admin)
First, manually update a user's role to "admin" in MongoDB:

```javascript
db.users.updateOne(
  {phone: "+919876543210"},
  {$set: {role: "admin"}}
)
```

Then create products via API.

### 3. Test Full Flow
1. Login and get token
2. Add money to wallet
3. Browse products
4. Create order
5. Check subscription
6. Admin assigns credentials

## Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Start your bot and send a message
4. Get your chat ID from `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. Update `.env` with token and chat ID

## Production Deployment

### Security Checklist

- [ ] Change `SECRET_KEY` to a strong random value (32+ characters)
- [ ] Set `DEBUG=False`
- [ ] Configure proper CORS origins in `main.py`
- [ ] Use environment variables for all sensitive data
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS/SSL certificates
- [ ] Implement rate limiting
- [ ] Set up proper logging and monitoring
- [ ] Regular database backups

### Deployment Options

1. **Traditional Server**: Use gunicorn + nginx
2. **Docker**: Containerize the application
3. **Cloud**: Deploy to AWS/GCP/Azure
4. **Platform**: Use Railway, Render, or Heroku

### Sample Gunicorn Command

```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Database Collections

The application uses the following MongoDB collections:

- `users` - User accounts and profiles
- `products` - OTT plans/products
- `orders` - Purchase orders
- `subscriptions` - Active subscriptions
- `wallet_transactions` - Wallet transaction ledger
- `wallet_pending_transactions` - Pending payment transactions
- `notifications` - User notifications

## Support

For issues or questions:
1. Check API documentation at `/docs`
2. Review error messages in logs
3. Verify environment variables
4. Ensure MongoDB is running

## License

Proprietary - All rights reserved

---

**Built with ❤️ for OTTSONLY**
