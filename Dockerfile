ARG NODE_VERSION=22.10.0
ARG SRC_DIR=/src
ARG APP_DIR=/app

### Stage 1 -> building the application

# Defining from what image we want to build from
# (this image comes with Node.js and NPM already installed)
FROM node:${NODE_VERSION}-alpine AS build

#USER node

# Creating a directory to hold the application source code inside the image
WORKDIR ${SRC_DIR}

# Copying package.json and package-lock.json files in source files directory.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# When using npm version 4 or earlier a package-lock.json file will not be generated.
COPY package*.json ./

# Installing app dependencies
RUN npm i --force
RUN npm cache clean --force
RUN rm -rf /tmp/*

# Copying the rest files in source files directory
COPY . .

# Generating prisma client and building the application
#RUN npx prisma generate \
#    && npm run build

### Stage 2 -> running the application

#FROM node:${NODE_VERSION}-alpine as run

#COPY --from=build ${SRC_DIR}/build/* ${APP_DIR}/

# Run the application
CMD npm run start:containers
