FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create output directory
RUN mkdir -p output

# Expose port
EXPOSE 8080

# Start application
CMD ["npm", "start"]