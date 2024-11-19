# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Download and install Docker and Docker Compose.

## Downloading

```
git clone https://github.com/natallia-js/nodejs2024Q3-service.git
```

## Getting started

1. Switch to the necessary branch:

```
git checkout docker
```

2. Create .env file (based on .env.example): ./.env

(modify environment variables as needed; specifying ports, make sure there are no port conflicts in your system)

## Running application

Use Docker Compose to run the application:

```
npm run docker:up:build
```

or

```
npm run docker:up
```

The first command builds Docker images and starts database and app services defined in docker-compose.yml file. 

The second command just starts services, without building them.

In both cases application is started in development mode and automatically rebuilds on changes made in source code.

After starting the app on port (4000 as default) you can access it in your browser (http://localhost:4000) and open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.

## How to stop running containers

1. To stop containers without their deletion:

```
npm run docker:stop
```

2. To stop containers, remove them and all volumes and networks that were created by `npm run docker` command:

```
npm run docker:down
```

To remove all the mentioned above including volumes:

```
npm run docker:down:volumes
```

## Where to find built images

Built application and database images are pushed to DockerHub:

```
natalliaf/nodejs2024q3-service-app:latest (image size 452.98 Mb)
natalliaf/nodejs2024q3-service-postgresdb:latest (image size 426.71 Mb)
```

## Docker security scan

You can use the following npm scripts to scan Docker images for vulnerabilities:

1. To display a complete view of all the vulnerabilities in the image:

```
npm run docker:scan:app:cves (for application image)
npm run docker:scan:db:cves (for database image)
```

2.  To display a quick overview of an image (an overview of the vulnerabilities found in a given image and its base image):

```
npm run docker:scan:app:quickview (for application image)
npm run docker:scan:db:quickview (for database image)
```

## Testing

Make sure, before testing, to do the following:

```
npm install
```

Then run the application [in container]. After application running open new terminal and enter:

To run all tests without authorization

auth.module.ts

comment

{
    provide: APP_GUARD,
    useClass: AuthGuard,
},

```
npm run test
```

!Attention: some tests on `npm run test` may fail due to @unique constraint on model User.
Remove this constraint, recreate Prisma Client and reapply migrations.

![test results](images_for_readme/no-auth-test-results1.png)

![test results](images_for_readme/no-auth-test-results2.png)

To run only one of all test suites

```
npm run test -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
