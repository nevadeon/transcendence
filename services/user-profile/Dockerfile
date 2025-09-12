FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Crée un dossier pour le fichier SQLite
RUN mkdir -p /data
ENV DB_PATH=/data/users.sqlite

EXPOSE 3001
CMD ["node", "src/index.js"]