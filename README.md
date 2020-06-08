# RemoteDailyRandomSpeaker

A tiny webapp that selects a random speaker for a remote daily meeting.

## Installation

1. Download and install NodeJS and NPM.
2. On the root project folder, run `npm install` to install the client side dependencies.
3. Go to the `api` folder. Run `npm install` to install the server side dependencies.

## Running the application

1. First of all, edit the `.env` file and set the value of the `MONGO_DB_CONNECTION_STRING` environment variable with you MongoDB connection string.
2. On the root project folder, run `make run_app` to launch the application.
3. Open `http://localhost:4200/` in your browser.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
