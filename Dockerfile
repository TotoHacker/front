# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa de producción con nginx
FROM nginx:alpine

# Copiamos el build a la ruta pública de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiamos configuración personalizada de nginx
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

