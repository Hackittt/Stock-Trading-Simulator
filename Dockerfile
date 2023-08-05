FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
WORKDIR /app
CMD ["npm", "start"]