FROM node:lts

WORKDIR /app
COPY . .
RUN npm install --omit=dev
