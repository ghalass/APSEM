FROM nginx:alpine

# Supprimer la configuration par défaut
RUN rm -f /etc/nginx/conf.d/default.conf

# Copier la configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

# Créer les dossiers de logs
RUN mkdir -p /var/log/nginx

# Exposer les ports
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]