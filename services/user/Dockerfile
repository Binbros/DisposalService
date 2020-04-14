FROM node:10-alpine as base
ENV NODE_ENV=production
EXPOSE 8000
RUN mkdir /user && apk add --no-cache tini
WORKDIR /user
COPY package.json package-lock.json*  ./
RUN npm install --only=production && npm cache clean --force 


FROM base as dev 
ENV NODE_ENV=developement
RUN npm install --only=development
CMD ["npm", "start"]

FROM dev as build
COPY . .
RUN npm run build
RUN rm -rf ./src/

FROM base as prod
COPY --from=build /user/build/ /user
USER node
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
