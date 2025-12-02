2. Configurez le Nginx système comme reverse proxy
   Arrêtez d'abord le Nginx Docker car il utilise le port 8080, et configurez le Nginx système pour utiliser le port 80 :

bash

# Arrêtez le container Nginx Docker (nous utiliserons le Nginx système)

docker-compose stop nginx

# Modifiez docker-compose.yml pour ne pas exposer de ports sur le service nginx

# (ou supprimez complètement le service nginx)

# Configurez le Nginx système

sudo nano /etc/nginx/sites-available/apsem
Ajoutez cette configuration :

nginx
server {
listen 80;
server_name apsem.ghalass.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

}

server {
listen 80;
server_name apsem.api.ghalass.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # CORS
        add_header 'Access-Control-Allow-Origin' 'https://apsem.ghalass.com' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type' always;
    }

}
Activez la configuration :

bash
sudo ln -s /etc/nginx/sites-available/apsem /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Corrigez le port d'écoute dans le container

docker exec apsem-frontend-1 sed -i 's/listen 3000;/listen 80;/g' /etc/nginx/conf.d/default.conf

# Redémarrez Nginx dans le container

docker exec apsem-frontend-1 nginx -s reload

# Vérifiez la modification

docker exec apsem-frontend-1 cat /etc/nginx/conf.d/default.conf | grep "listen"

# Devrait afficher: listen 80;
