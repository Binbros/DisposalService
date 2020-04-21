FROM node:alpine as base
RUN mkdir /email
WORKDIR /email
COPY . .
RUN npm install  && npm cache clean --force 
CMD ["node", "index.js"]
