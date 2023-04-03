# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/apps/auth

# Set envs
ARG AUTH_BACK_PORT=3400

# Copy builded app source
COPY ./dist/apps/auth .

# Install app dependencies
RUN npm install

CMD ["node", "main.js"]
