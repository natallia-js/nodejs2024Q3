# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Download and install Docker and Docker Compose.

## Downloading

```
git clone {repository URL}
```

## Getting started

1. Create .env file (based on .env.example): ./.env
(modify environment variables as needed; specifying ports, make sure there are no port conflicts in your system)

2. Generate Prisma Client:
```
npx prisma generate
```

## Running application

Use Docker Compose to run the application:

```
npm run docker
```

This command builds Docker images and starts database and app services defined in docker-compose.yml file.

After starting the app on port (4000 as default) you can access it in your browser (http://localhost:4000) and open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.

## Docker security scan

You can use the following npm scripts to scan Docker images for vulnerabilities:

```
npm run dockerscan:app (for application image)
npm run dockerscan:db (for database image)
```

## How to stop the application

```
docker-compose down
```

This command stops the application, removes containers, volumes and newtworks that were created by
```
npm run docker
```
command.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```
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
