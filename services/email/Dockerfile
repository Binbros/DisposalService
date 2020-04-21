FROM node:10-alpine as base
RUN mkdir /email
WORKDIR /email
COPY package.json package-lock.json*  ./
RUN npm install  && npm cache clean --force 
CMD ["node", "index.js"]
