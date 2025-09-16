FROM node:20-alpine

WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer dépendances
RUN npm install fastify@^5.6.0
RUN npm install @fastify/swagger@^9.5.1
RUN npm install @fastify/swagger-ui@^5.0.0
RUN npm install sqlite
RUN npm install argon2
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 3001

# Lancer l’app
CMD ["npm", "start"]