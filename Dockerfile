FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# NODE_ENV is supplied via docker-compose.
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "start"]

