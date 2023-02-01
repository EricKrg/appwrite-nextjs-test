#!/bin/sh

echo "---------------------------------------------------------------"
echo "================= CLOUDFLARE TUNNEL INSTALL ==================="
echo "---------------------------------------------------------------"

wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb && dpkg -i cloudflared-linux-amd64.deb
dpkg -i cloudflared-linux-amd64.deb