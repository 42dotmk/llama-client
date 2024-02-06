# Stage 1: Build the Angular app
FROM node:latest as build-step

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:alpine

COPY --from=build-step /app/dist/client/browser /usr/share/nginx/html

EXPOSE 80