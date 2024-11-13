ARG NODE_VERSION=22.10.0
ARG SRC_DIR=/src

# Defining from what image we want to build from
# (this image comes with Node.js and NPM already installed)
FROM node:${NODE_VERSION}-alpine AS build

# Creating a directory to hold the application source code inside the image
WORKDIR ${SRC_DIR}

# Copying package.json and package-lock.json files in source files directory.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# When using npm version 4 or earlier a package-lock.json file will not be generated.
COPY package*.json ./

# Installing app dependencies
RUN npm ci && npm cache clean --force

# Copying the rest files in source files directory
COPY . .

FROM node:${NODE_VERSION}-alpine as run
WORKDIR ${SRC_DIR}
COPY --from=build ${SRC_DIR} ${SRC_DIR}
CMD npm run start:containers
