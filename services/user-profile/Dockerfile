FROM node:20-alpine
WORKDIR /usr/src/app

# Installer outils nécessaires à la compilation de dépendances natives
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install
COPY . .

# Crée un dossier pour le fichier SQLite
RUN mkdir -p /data
ENV DB_PATH=/data/users.sqlite

EXPOSE 3001
CMD ["node", "src/index.js"]