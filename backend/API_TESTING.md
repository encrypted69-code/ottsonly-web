# OTTSONLY API Testing Guide

This guide provides example API calls for testing all endpoints.

## Setup

1. Start the server: `python main.py`
2. Server runs at: `http://localhost:8000`
3. API Docs: `http://localhost:8000/docs`

## Variables

Replace these in the examples:
- `{TOKEN}` - Your JWT access token
- `{USER_ID}` - User ID
- `{PRODUCT_ID}` - Product ID
- `{ORDER_ID}` - Order ID
- `{SUBSCRIPTION_ID}` - Subscription ID

## 1. Authentication

### Login (Send OTP)
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "phone": "+919876543210",
  "otp": "123456"
}
```

### Verify OTP
```bash
curl -X POST http://localhost:8000/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "otp": "123456"
  }'
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

### Get Current User
```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer {TOKEN}"
```

## 2. Users

### Get My Profile
```bash
curl -X GET http://localhost:8000/users/me \
  -H "Authorization: Bearer {TOKEN}"
```

### Update My Profile
```bash
curl -X PATCH http://localhost:8000/users/me \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

### List All Users (Admin Only)
```bash
curl -X GET "http://localhost:8000/users/?skip=0&limit=100" \
  -H "Authorization: Bearer {TOKEN}"
```

## 3. Products

### List All Products (Public)
```bash
curl -X GET "http://localhost:8000/products/?active_only=true"
```

### Get Product by ID
```bash
curl -X GET http://localhost:8000/products/{PRODUCT_ID}
```

### Create Product (Admin Only)
```bash
curl -X POST http://localhost:8000/products/ \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "platform_name": "Netflix",
    "plan_name": "Premium 4K",
    "price": 649.0,
    "duration_days": 30,
    "stock": 50,
    "is_active": true,
    "description": "Ultra HD streaming on 4 devices"
  }'
```

### Update Product (Admin Only)
```bash
curl -X PATCH http://localhost:8000/products/{PRODUCT_ID} \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 599.0,
    "stock": 75
  }'
```

### Delete Product (Admin Only)
```bash
curl -X DELETE http://localhost:8000/products/{PRODUCT_ID} \
  -H "Authorization: Bearer {TOKEN}"
```

## 4. Wallet

### Get Wallet Balance
```bash
curl -X GET http://localhost:8000/wallet/balance \
  -H "Authorization: Bearer {TOKEN}"
```

### Add Money (Create Razorpay Order)
```bash
curl -X POST http://localhost:8000/wallet/add-money \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000.0}'
```

**Response:**
```json
{
  "order_id": "order_xxx",
  "amount": 1000.0,
  "currency": "INR",
  "razorpay_key": "rzp_test_xxx"
}
```

### Verify Payment
```bash
curl -X POST http://localhost:8000/wallet/verify-payment \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_xxx",
    "razorpay_payment_id": "pay_xxx",
    "razorpay_signature": "signature_xxx"
  }'
```

### Get Transaction History
```bash
curl -X GET http://localhost:8000/wallet/transactions \
  -H "Authorization: Bearer {TOKEN}"
```

### Admin Wallet Operation (Admin Only)
```bash
curl -X POST http://localhost:8000/wallet/admin-operation \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "{USER_ID}",
    "amount": 500.0,
    "operation": "credit",
    "description": "Promotional bonus"
  }'
```

## 5. Orders

### Create Order
```bash
curl -X POST http://localhost:8000/orders/ \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"product_id": "{PRODUCT_ID}"}'
```

### Get My Orders
```bash
curl -X GET http://localhost:8000/orders/my-orders \
  -H "Authorization: Bearer {TOKEN}"
```

### List All Orders (Admin Only)
```bash
curl -X GET http://localhost:8000/orders/ \
  -H "Authorization: Bearer {TOKEN}"
```

### Get Order by ID
```bash
curl -X GET http://localhost:8000/orders/{ORDER_ID} \
  -H "Authorization: Bearer {TOKEN}"
```

### Refund Order (Admin Only)
```bash
curl -X POST http://localhost:8000/orders/{ORDER_ID}/refund \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Product not available"}'
```

## 6. Subscriptions

### Get My Subscriptions
```bash
curl -X GET http://localhost:8000/subscriptions/my-subscriptions \
  -H "Authorization: Bearer {TOKEN}"
```

### List All Subscriptions (Admin Only)
```bash
curl -X GET "http://localhost:8000/subscriptions/?status=active" \
  -H "Authorization: Bearer {TOKEN}"
```

### Get Subscription by ID
```bash
curl -X GET http://localhost:8000/subscriptions/{SUBSCRIPTION_ID} \
  -H "Authorization: Bearer {TOKEN}"
```

### Assign Credentials (Admin Only)
```bash
curl -X POST http://localhost:8000/subscriptions/{SUBSCRIPTION_ID}/assign-credentials \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user@example.com",
    "password": "password123",
    "profile_name": "Profile 1",
    "notes": "Use profile 1 only"
  }'
```

### Cancel Subscription (Admin Only)
```bash
curl -X POST http://localhost:8000/subscriptions/{SUBSCRIPTION_ID}/cancel \
  -H "Authorization: Bearer {TOKEN}"
```

## 7. Notifications

### Get My Notifications
```bash
curl -X GET "http://localhost:8000/notifications/?unread_only=true" \
  -H "Authorization: Bearer {TOKEN}"
```

### Get Unread Count
```bash
curl -X GET http://localhost:8000/notifications/unread-count \
  -H "Authorization: Bearer {TOKEN}"
```

### Mark as Read
```bash
curl -X POST http://localhost:8000/notifications/{NOTIFICATION_ID}/read \
  -H "Authorization: Bearer {TOKEN}"
```

### Mark All as Read
```bash
curl -X POST http://localhost:8000/notifications/mark-all-read \
  -H "Authorization: Bearer {TOKEN}"
```

### Delete Notification
```bash
curl -X DELETE http://localhost:8000/notifications/{NOTIFICATION_ID} \
  -H "Authorization: Bearer {TOKEN}"
```

### Send Bulk Notification (Admin Only)
```bash
curl -X POST http://localhost:8000/notifications/bulk \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "System Maintenance",
    "message": "Our platform will be under maintenance tonight",
    "type": "announcement"
  }'
```

## Testing Complete Flow

### 1. User Registration & Login
```bash
# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# Verify
curl -X POST http://localhost:8000/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "otp": "123456"}'
```

### 2. Add Money to Wallet (Admin)
```bash
# As admin, credit user wallet
curl -X POST http://localhost:8000/wallet/admin-operation \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "{USER_ID}",
    "amount": 1000.0,
    "operation": "credit",
    "description": "Test credit"
  }'
```

### 3. Browse & Purchase
```bash
# List products
curl -X GET http://localhost:8000/products/?active_only=true

# Create order
curl -X POST http://localhost:8000/orders/ \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"product_id": "{PRODUCT_ID}"}'
```

### 4. Check Subscription
```bash
curl -X GET http://localhost:8000/subscriptions/my-subscriptions \
  -H "Authorization: Bearer {TOKEN}"
```

### 5. Admin Assigns Credentials
```bash
curl -X POST http://localhost:8000/subscriptions/{SUBSCRIPTION_ID}/assign-credentials \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "netflix@example.com",
    "password": "pass123",
    "profile_name": "Profile 1"
  }'
```

## Using Swagger UI (Recommended)

1. Open: http://localhost:8000/docs
2. Click **"Authorize"** button (🔒)
3. Enter: `Bearer {YOUR_TOKEN}`
4. Click **"Authorize"** then **"Close"**
5. Now all endpoints are authenticated!
6. Expand any endpoint and click **"Try it out"**
7. Fill parameters and click **"Execute"**

## Postman Collection

You can import these as a Postman collection:
1. File → Import → Raw text
2. Paste the curl commands
3. Set environment variables for TOKEN, USER_ID, etc.

## Response Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

**Happy Testing! 🧪**
