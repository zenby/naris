FROM node:lts

WORKDIR /app
RUN mkdir .husky
COPY *.json ./
COPY *.js ./
COPY *.ts ./
RUN npm install