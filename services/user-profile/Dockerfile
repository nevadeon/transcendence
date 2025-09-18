# Dockerfile

FROM node:20

# Installez les outils de construction nécessaires
# RUN apk add --no-cache python3 g++ make

WORKDIR /usr/src/app

# Copiez package.json et package-lock.json pour tirer parti du cache
COPY package*.json ./

# Installez toutes les dépendances
RUN npm install

# Copiez le reste du code de l'application
COPY . .

# Exposer le port de l'application
EXPOSE 3001

# Lancer l'application
CMD ["npm", "start"]