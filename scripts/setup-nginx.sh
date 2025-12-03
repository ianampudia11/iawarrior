#!/bin/bash

# Nginx and SSL Setup Script for Iawarrior tech
# Run this on your Ubuntu VPS as root

set -e

DOMAIN="chat.ianampudia.com"
EMAIL="admin@ianampudia.com"
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Configuring Nginx for $DOMAIN...${NC}"

# Install Nginx and Certbot if missing
apt-get install -y nginx certbot python3-certbot-nginx

# Configure Nginx
cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t
systemctl reload nginx

echo -e "${GREEN}Setting up SSL with Certbot...${NC}"
# Request SSL certificate
certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m "$EMAIL" --redirect

echo -e "${GREEN}Nginx and SSL Setup Complete!${NC}"
echo -e "Access your app at: https://$DOMAIN"
