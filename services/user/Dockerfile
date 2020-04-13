FROM node:10-alpine

EXPOSE 8000



RUN mkdir /user && apk add --no-cache tini

WORKDIR /user


COPY package.json package-lock.json* ./

COPY . .
# RUN npm i -g tslint typescript

RUN npm install && npm cache clean --force 

# RUN npm run build 

USER node



# COPY --chown=node:node . .


ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "start"]