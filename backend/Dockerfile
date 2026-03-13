FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy backend code
COPY . .

# Expose backend port
EXPOSE 5200

# Start backend
CMD ["node", "src/server.js"]
