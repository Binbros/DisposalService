# use an existing docker image as a base
FROM alpine
# download and install dependencies
RUN apk add --update redis
RUN apk add --update gcc
# tells the image what to do when it's start as a container
CMD ["redis-server"]