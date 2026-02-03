# 1️⃣ Stage: билд проекта
FROM node:20-alpine AS build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Собираем приложение для продакшна
RUN npm run build

# 2️⃣ Stage: production сервер (Nginx)
FROM nginx:alpine

# Копируем билд React в Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Настройка Nginx (если нужно, можно добавить свой конфиг)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
