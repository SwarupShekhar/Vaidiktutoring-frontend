# Use official Node.js Alpine image for a small footprint
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm install

# Copy source code
COPY . .

# Expose port (Northflank will dynamically map the internal port)
EXPOSE 10000

# Start the server
CMD ["npm", "start"]
