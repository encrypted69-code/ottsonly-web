#!/bin/bash
# Quick deployment script for OTTSONLY on VPS
# Run this after pulling changes from GitHub

set -e  # Exit on error

echo "🚀 OTTSONLY - Quick Deployment Script"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "backend/main.py" ]; then
    echo -e "${RED}Error: Not in OTTSONLY root directory${NC}"
    echo "Please run this script from /var/www/ottsonly"
    exit 1
fi

echo -e "${YELLOW}Step 1: Checking environment files...${NC}"
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}Error: backend/.env not found${NC}"
    echo "Please create it: cp backend/.env.example backend/.env"
    echo "And configure all required values"
    exit 1
fi

if [ ! -f "frontend-main/.env" ]; then
    echo -e "${YELLOW}Creating frontend-main/.env${NC}"
    echo "VITE_API_URL=https://ottsonly.in/api" > frontend-main/.env
fi

if [ ! -f "frontend-admin/.env" ]; then
    echo -e "${YELLOW}Creating frontend-admin/.env${NC}"
    echo "VITE_API_URL=https://ottsonly.in/api" > frontend-admin/.env
fi

echo -e "${GREEN}✓ Environment files OK${NC}"
echo ""

echo -e "${YELLOW}Step 2: Installing backend dependencies...${NC}"
cd backend
pip3 install -r requirements.txt > /dev/null 2>&1
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
cd ..
echo ""

echo -e "${YELLOW}Step 3: Building frontend-main...${NC}"
cd frontend-main
npm install > /dev/null 2>&1
npm run build
echo -e "${GREEN}✓ Frontend-main built${NC}"
cd ..
echo ""

echo -e "${YELLOW}Step 4: Building frontend-admin...${NC}"
cd frontend-admin
npm install > /dev/null 2>&1
npm run build
echo -e "${GREEN}✓ Frontend-admin built${NC}"
cd ..
echo ""

echo -e "${YELLOW}Step 5: Setting up Nginx configuration...${NC}"
if [ -f "/etc/nginx/sites-available/ottsonly.in" ]; then
    echo -e "${GREEN}✓ Nginx config already exists${NC}"
else
    echo "Copying Nginx configuration..."
    sudo cp nginx.conf /etc/nginx/sites-available/ottsonly.in
    sudo ln -s /etc/nginx/sites-available/ottsonly.in /etc/nginx/sites-enabled/
    echo -e "${GREEN}✓ Nginx configured${NC}"
fi

# Test nginx config
echo "Testing Nginx configuration..."
sudo nginx -t
echo ""

echo -e "${YELLOW}Step 6: Setting up backend service...${NC}"
if [ ! -f "/etc/systemd/system/ottsonly-backend.service" ]; then
    echo -e "${YELLOW}Creating systemd service file...${NC}"
    sudo bash -c 'cat > /etc/systemd/system/ottsonly-backend.service << EOF
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
EOF'
    sudo systemctl daemon-reload
    sudo systemctl enable ottsonly-backend
    echo -e "${GREEN}✓ Service created and enabled${NC}"
else
    echo -e "${GREEN}✓ Service already exists${NC}"
fi
echo ""

echo -e "${YELLOW}Step 7: Setting file permissions...${NC}"
sudo chown -R www-data:www-data /var/www/ottsonly
sudo chmod -R 755 backend/uploads 2>/dev/null || mkdir -p backend/uploads && sudo chmod -R 755 backend/uploads
echo -e "${GREEN}✓ Permissions set${NC}"
echo ""

echo -e "${YELLOW}Step 8: Restarting services...${NC}"
sudo systemctl restart ottsonly-backend
sudo systemctl reload nginx
echo -e "${GREEN}✓ Services restarted${NC}"
echo ""

echo -e "${YELLOW}Step 9: Checking service status...${NC}"
if sudo systemctl is-active --quiet ottsonly-backend; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend is not running${NC}"
    echo "Check logs: sudo journalctl -u ottsonly-backend -n 50"
fi

if sudo systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓ Nginx is running${NC}"
else
    echo -e "${RED}✗ Nginx is not running${NC}"
fi
echo ""

echo -e "${GREEN}======================================"
echo "🎉 Deployment Complete!"
echo "======================================"
echo ""
echo "Your site should be live at:"
echo "  • Main: https://ottsonly.in"
echo "  • Admin: https://ottsonly.in/admin"
echo "  • API: https://ottsonly.in/api"
echo ""
echo "Check logs:"
echo "  • Backend: sudo journalctl -u ottsonly-backend -f"
echo "  • Nginx: sudo tail -f /var/log/nginx/ottsonly_error.log"
echo ""
echo -e "${YELLOW}Note: If SSL certificate is not set up, run:${NC}"
echo "  sudo certbot --nginx -d ottsonly.in -d www.ottsonly.in"
echo ""
