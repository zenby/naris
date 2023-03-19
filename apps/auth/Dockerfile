# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/apps/auth

# Set envs
ARG PORT=8000

# Copy builded app source
COPY ../../dist/apps/auth .

# Install app dependencies
RUN npm install

CMD ["node", "main.js"]