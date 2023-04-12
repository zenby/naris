# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/apps/naris-api

# Set envs
ARG NARIS_API_BACK_PORT=3500

# Copy builded app source
COPY ./dist/apps/naris-api .

# Install app dependencies
RUN npm install

CMD ["node", "main.js"]
