#!/bin/bash
set -e
cd /var/www/ottsonly

echo "⏱️  DEPLOYMENT TIME ESTIMATE: 10-15 minutes"
echo "============================================"

# Step 1: Backend Setup (2-3 minutes)
echo "[1/4] Setting up Python backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt
mkdir -p uploads

# Copy production env
cp .env.production .env

# Step 2: Build Frontend Main (3-4 minutes)
echo "[2/4] Building main frontend..."
cd ../frontend-main
npm install --silent
npm run build

# Step 3: Build Frontend Admin (3-4 minutes)
echo "[3/4] Building admin frontend..."
cd ../frontend-admin
npm install --silent
npm run build

# Step 4: Configure services (1-2 minutes)
echo "[4/4] Configuring services..."

# Create systemd service
sudo tee /etc/systemd/system/ottsonly-backend.service > /dev/null << EOF
[Unit]
Description=OTTSONLY Backend
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/var/www/ottsonly/backend
Environment="PATH=/var/www/ottsonly/backend/venv/bin"
ExecStart=/var/www/ottsonly/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Configure Nginx
sudo tee /etc/nginx/sites-available/ottsonly > /dev/null << 'NGINXEOF'
server {
    listen 80;
    server_name ottsonly.in www.ottsonly.in;
    root /var/www/ottsonly/frontend-main/dist;
    index index.html;

    location /api/ {
        rewrite ^/api(.*)$ $1 break;
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /admin {
        alias /var/www/ottsonly/frontend-admin/dist;
        try_files $uri $uri/ /admin/index.html;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINXEOF

sudo ln -sf /etc/nginx/sites-available/ottsonly /etc/nginx/sites-enabled/
sudo nginx -t

# Start services
sudo systemctl daemon-reload
sudo systemctl enable ottsonly-backend
sudo systemctl restart ottsonly-backend
sudo systemctl restart nginx

echo "✅ DEPLOYMENT COMPLETE!"
echo "⏱️  Total time: ~10-12 minutes"
echo ""
echo "📝 NEXT STEPS:"
echo "1. Edit /var/www/ottsonly/backend/.env"
echo "2. Generate keys: cd /var/www/ottsonly/backend && source venv/bin/activate && python3 -c \"import secrets; print(secrets.token_urlsafe(64))\""
echo "3. Restart: sudo systemctl restart ottsonly-backend"
echo "4. Setup DNS A records to 159.195.84.250"
echo "5. Install SSL: sudo certbot --nginx -d ottsonly.in -d www.ottsonly.in"
