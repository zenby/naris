# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/apps/auth

# Set envs
ARG PORT=8000

# Copy package.json AND package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy builded app source
COPY ../../dist/apps/auth .

CMD ["node", "auth/main.js"]