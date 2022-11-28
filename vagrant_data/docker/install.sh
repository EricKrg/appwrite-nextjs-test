#!/bin/sh

echo "---------------------------------------------------------------"
echo "================== DOCKER COMPOSE INSTALL ====================="
echo "---------------------------------------------------------------"

#sudo su -
curl -SL https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
which docker-compose
docker-compose -v
