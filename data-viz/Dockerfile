# Step 1: Use an official Node.js runtime as a parent image
FROM node:16-alpine AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json into the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code into the container
COPY . .

# Step 6: Build the React app
RUN npm run build

# Step 7: Use an Nginx image to serve the static files
FROM nginx:alpine

# Step 8.1: Copy the Nginx conf for React Routing
COPY nginx.conf /etc/nginx/nginx.conf

# Step 8.2: Copy the React build output from the previous build stage to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Step 9: Expose port 80
EXPOSE 80

# Step 10: Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]