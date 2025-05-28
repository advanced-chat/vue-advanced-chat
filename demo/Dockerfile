# Stage 1: Build the Vue.js demo application
FROM node:18-alpine AS build-stage

LABEL maintainer="Vue Advanced Chat Dev Team"
LABEL description="Build stage for the Vue Advanced Chat demo application"

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
# We copy these first to leverage Docker cache for dependencies
COPY package.json ./
# Assuming npm is used because of package-lock.json in reset script
# The following line for package-lock.json is removed as per instructions
# COPY package-lock.json ./

# Install dependencies for the demo app
RUN npm install

# Copy the rest of the demo application source code
COPY . .

# Build the application
# The build script is "vite build" as found in demo/package.json
RUN npm run build

# Stage 2: Serve the built application using Nginx
FROM nginx:stable-alpine AS serve-stage

LABEL maintainer="Vue Advanced Chat Dev Team"
LABEL description="Serve stage for the Vue Advanced Chat demo application"

# Copy built assets from the build stage
# Vite builds to a 'dist' directory by default
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
