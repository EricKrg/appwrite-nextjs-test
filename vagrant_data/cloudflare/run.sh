#!/bin/sh

echo "---------------------------------------------------------------"
echo "=================== HTTPS TUNNEL RUN =========================="
echo "---------------------------------------------------------------"

cd /vagrant/cloudflare && cloudflared tunnel --url http://localhost
