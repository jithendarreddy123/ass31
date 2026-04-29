# Lab27 MERN App

MERN CRUD sample with a React frontend, Express backend, MongoDB, Docker Compose, and Jenkins pipeline support.

## Run With Docker

```sh
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Backend health: http://localhost:5000/health

## Local Checks

```sh
cd backend
npm ci
npm test

cd ../frontend
npm ci
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

## Jenkins Setup

Create these Jenkins credentials before running the pipeline:

- `dockerhub-credentials`: Username/password credential for Docker Hub.

The pipeline installs dependencies, runs backend and frontend checks, and builds Docker images. To push images from the `main` branch, set `DOCKER_IMAGE_NAMESPACE` and enable `PUSH_DOCKER_IMAGES` when starting the Jenkins build.
