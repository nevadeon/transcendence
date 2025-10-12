# --- Étape 1 : Build avec Node ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

# --- Étape 2 : Serveur Nginx pour production ---
FROM nginx:stable-alpine
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]