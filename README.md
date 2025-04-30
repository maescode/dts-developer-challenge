# Getting Started: DTS Developer Technical Test

This guide explains how to start both the backend (API) and frontend (UI) for local development.

Note:

- The frontend expects the backend API to be running at <http://localhost:3001>
- For development, always start the backend first, then the frontend.

## Backend (Task Management API)

1. Install dependencies:

```bash
cd backend
npm install
```

2. Start the backend in development mode:

`npm run dev`

- The backend server will start on port 3001 by default.

## Frontend (HMCTS Dev Test Frontend)

1. Install dependencies:

```bash
cd frontend
yarn install
```

2. Build frontend assets:

`yarn webpack`

3. Start the frontend in development mode:

`yarn start:dev`

This will run a script that generates SSL certificates (if needed) and starts the server on <https://localhost:3100>.

Thank you

## To start the backend and frontend concurrently (Easy)

Open your terminal and navigate to the root folder of the project

```bash
 cd dts-developer-challenge
 npm install
 npm run start
```

- The backend server will start on port 3001 by default.
- The frontend will start on port 3100 by default.

## Note

- For details on the backend API, please check the README.md file located in the backend directory.
