# --- Étape 1 : Build avec Node ---
FROM node:20-alpine AS build

# Crée le dossier de travail
WORKDIR /app

# Installer les dépendances de build
COPY package*.json ./
RUN npm ci

# Copier tout le code source
COPY . .

# Build de l'application pour production
RUN npm install
RUN npm run build

# --- Étape 2 : Serveur Nginx pour production ---
FROM nginx:stable-alpine

# Copier le build Vite dans le dossier Nginx
COPY dist/ /usr/share/nginx/html/

# Expose le port 80 à l'intérieur du conteneur
EXPOSE 80

# Lancer Nginx au premier plan
CMD ["nginx", "-g", "daemon off;"]