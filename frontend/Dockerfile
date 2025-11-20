FROM node:18-alpine

WORKDIR /app

# Install dependencies for Expo
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Expo ports
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start Expo with LAN mode for Docker
CMD ["npx", "expo", "start", "--host", "lan", "--port", "19000"]

