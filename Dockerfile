FROM node:20.17.0

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5678
CMD [ "npm", "start" ]
