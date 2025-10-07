FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 3004

# Lancer l'application
CMD ["node", "src/app.js"]