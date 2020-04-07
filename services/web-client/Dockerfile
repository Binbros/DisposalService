FROM node:alpine


WORKDIR /web-client


# Run the command inside your image filesystem
RUN npm install react-scripts -g --silent
RUN npm install --silent
# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 8080
COPY package.json /app/package.json
# Copy the file from your host to your current location
COPY ./web-client
RUN npm run build
# Run the specified command within the container.
CMD [ "npm", "start" ]