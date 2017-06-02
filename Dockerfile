FROM node:6-alpine
MAINTAINER LeanKit

ENV APP_PATH /app
WORKDIR $APP_PATH

# Install dependencies to leverage caching
COPY package.json package.json
RUN npm install --production

# Install the rest of the app
COPY . .
RUN .docker/build.sh && rm -rf .docker

# Default port
EXPOSE 4390

# Entrypoint script to set env vars when linking containers for dev
# Runs tini to handle zombie process reaping and pass signals to Node correctly
COPY .docker /
ENTRYPOINT [ "/sbin/tini", "--", "/usr/local/bin/entry.sh" ]
CMD [ "node", "./src/index.js" ]
