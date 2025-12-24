#!/bin/bash

# ========================================
# OTTSONLY VPS Deployment Script
# ========================================
# Run this script on your VPS after cloning the repository
# Usage: bash deploy-to-vps.sh

set -e  # Exit on error

echo "🚀 Starting OTTSONLY Deployment..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="ottsonly.in"
PROJECT_DIR="/var/www/ottsonly"
BACKEND_PORT=8000

# ========================================
# Step 1: System Update & Prerequisites
# ========================================
echo -e "${YELLOW}[1/8] Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${YELLOW}Installing essential packages...${NC}"
sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    nginx \
    certbot \
    python3-certbot-nginx \
    git \
    ufw \
    fail2ban \
    curl \
    nodejs \
    npm

# Install PM2 for process management
sudo npm install -g pm2

# ========================================
# Step 2: Firewall Configuration
# ========================================
echo -e "${YELLOW}[2/8] Configuring firewall...${NC}"
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw --force enable

# ========================================
# Step 3: Clone Repository
# ========================================
echo -e "${YELLOW}[3/8] Setting up project directory...${NC}"
sudo mkdir -p /var/www
cd /var/www

if [ -d "$PROJECT_DIR" ]; then
    echo -e "${GREEN}Project directory exists. Pulling latest changes...${NC}"
    cd $PROJECT_DIR
    git pull origin main
else
    echo -e "${GREEN}Cloning repository...${NC}"
    sudo git clone https://github.com/encrypted69-code/ottsonly-web.git ottsonly
    cd $PROJECT_DIR
fi

# Set proper permissions
sudo chown -R $USER:$USER $PROJECT_DIR

# ========================================
# Step 4: Backend Setup
# ========================================
echo -e "${YELLOW}[4/8] Setting up Python backend...${NC}"
cd $PROJECT_DIR/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create production .env file (will need manual editing)
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating backend .env file...${NC}"
    cat > .env << 'EOF'
# Application
APP_NAME=OTTSONLY
DEBUG=False
ENVIRONMENT=production

# MongoDB (UPDATE THIS)
MONGODB_URL=mongodb+srv://your_user:your_password@cluster.mongodb.net/?appName=ottsonly
DATABASE_NAME=ottsonly_db

# JWT (GENERATE NEW KEYS)
SECRET_KEY=CHANGE_THIS_TO_RANDOM_64_CHARS
REFRESH_SECRET_KEY=CHANGE_THIS_TO_DIFFERENT_RANDOM_64_CHARS
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
REFRESH_TOKEN_EXPIRE_DAYS=7

# Admin Configuration
SUPER_ADMIN_EMAIL=admin@ottsonly.in
SUPER_ADMIN_PASSWORD=CHANGE_THIS_PASSWORD

# Server Configuration
BACKEND_PORT=8000
FRONTEND_URL=https://ottsonly.in
ADMIN_URL=https://ottsonly.in/admin

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_PER_MINUTE=60

# Razorpay (UPDATE THIS)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Telegram Bot (Optional)
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_ID=

# n8n Webhooks
N8N_WEBHOOK_URL=

# YouTube Settings
YOUTUBE_MAX_EDITS=1

# Default Wallet Balance
DEFAULT_WALLET_BALANCE=0
EOF
    echo -e "${RED}⚠️  IMPORTANT: Edit backend/.env with your actual credentials${NC}"
    echo -e "${YELLOW}Run: nano $PROJECT_DIR/backend/.env${NC}"
fi

# Create uploads directory
mkdir -p uploads

# Generate secure keys
echo -e "${GREEN}Generate secure keys with these commands:${NC}"
echo "python3 -c \"import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(64))\""
echo "python3 -c \"import secrets; print('REFRESH_SECRET_KEY=' + secrets.token_urlsafe(64))\""

# Create systemd service for backend
echo -e "${YELLOW}Creating backend systemd service...${NC}"
sudo tee /etc/systemd/system/ottsonly-backend.service > /dev/null << EOF
[Unit]
Description=OTTSONLY FastAPI Backend
After=network.target

[Service]
Type=simple
User=$USER
Group=$USER
WorkingDirectory=$PROJECT_DIR/backend
Environment="PATH=$PROJECT_DIR/backend/venv/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=$PROJECT_DIR/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port $BACKEND_PORT --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# ========================================
# Step 5: Frontend Main Setup
# ========================================
echo -e "${YELLOW}[5/8] Building main frontend...${NC}"
cd $PROJECT_DIR/frontend-main

# Create production .env
cat > .env << 'EOF'
VITE_API_URL=/api
EOF

# Install dependencies and build
npm install
npm run build

# ========================================
# Step 6: Frontend Admin Setup
# ========================================
echo -e "${YELLOW}[6/8] Building admin frontend...${NC}"
cd $PROJECT_DIR/frontend-admin

# Create production .env
cat > .env << 'EOF'
VITE_API_URL=/api
EOF

# Install dependencies and build
npm install
npm run build

# ========================================
# Step 7: Nginx Configuration
# ========================================
echo -e "${YELLOW}[7/8] Configuring Nginx...${NC}"

# Remove default nginx site
sudo rm -f /etc/nginx/sites-enabled/default

# Create nginx configuration
sudo tee /etc/nginx/sites-available/ottsonly > /dev/null << 'EOF'
# Redirect HTTP to HTTPS (will be enabled after SSL setup)
server {
    listen 80;
    listen [::]:80;
    server_name ottsonly.in www.ottsonly.in;
    
    # Allow Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Temporary: serve content over HTTP until SSL is configured
    root /var/www/ottsonly/frontend-main/dist;
    index index.html;

    # API Proxy to Backend
    location /api/ {
        rewrite ^/api(.*)$ $1 break;
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Admin Panel Route
    location /admin {
        alias /var/www/ottsonly/frontend-admin/dist;
        try_files $uri $uri/ /admin/index.html;
        index index.html;
    }

    # Main Frontend SPA Routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static Assets Cache
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Uploads Directory
    location /uploads/ {
        alias /var/www/ottsonly/backend/uploads/;
        expires 7d;
        add_header Cache-Control "public";
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/ottsonly /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# ========================================
# Step 8: Start Services
# ========================================
echo -e "${YELLOW}[8/8] Starting services...${NC}"

# Reload systemd
sudo systemctl daemon-reload

# Enable and start backend
sudo systemctl enable ottsonly-backend
sudo systemctl start ottsonly-backend

# Restart nginx
sudo systemctl restart nginx

# ========================================
# Status Check
# ========================================
echo ""
echo "=================================="
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "=================================="
echo ""
echo "📋 Service Status:"
echo "  Backend: $(sudo systemctl is-active ottsonly-backend)"
echo "  Nginx: $(sudo systemctl is-active nginx)"
echo ""
echo "🔧 Next Steps:"
echo ""
echo "1. Configure backend .env file:"
echo "   nano $PROJECT_DIR/backend/.env"
echo "   - Update MONGODB_URL with your MongoDB credentials"
echo "   - Generate and set SECRET_KEY and REFRESH_SECRET_KEY"
echo "   - Update RAZORPAY credentials"
echo "   - Change SUPER_ADMIN_PASSWORD"
echo ""
echo "2. After editing .env, restart backend:"
echo "   sudo systemctl restart ottsonly-backend"
echo ""
echo "3. Check logs:"
echo "   sudo journalctl -u ottsonly-backend -f"
echo ""
echo "4. Point your domain DNS to this VPS IP:"
echo "   A record: ottsonly.in -> $(curl -s ifconfig.me)"
echo "   A record: www.ottsonly.in -> $(curl -s ifconfig.me)"
echo ""
echo "5. After DNS propagation, install SSL certificate:"
echo "   sudo certbot --nginx -d ottsonly.in -d www.ottsonly.in"
echo ""
echo "6. Enable auto-renewal for SSL:"
echo "   sudo systemctl enable certbot.timer"
echo ""
echo "🌐 Your site should be accessible at:"
echo "   http://$(curl -s ifconfig.me)"
echo "   (After DNS setup: https://ottsonly.in)"
echo ""
echo "📊 Useful Commands:"
echo "   - View backend logs: sudo journalctl -u ottsonly-backend -f"
echo "   - Restart backend: sudo systemctl restart ottsonly-backend"
echo "   - Restart nginx: sudo systemctl restart nginx"
echo "   - Check backend status: sudo systemctl status ottsonly-backend"
echo ""
