# RemoteDailyRandomSpeaker

A tiny webapp that selects a random speaker for a remote daily meeting.

## Installation

1. Download and install NodeJS and NPM.
2. On the root project folder, run `npm install` to install the client side dependencies.
3. Go to the `api` folder. Run `npm install` to install the server side dependencies.

## Running the application

1. First of all, edit the `api/database.js` file, adding the URL to connect to your MongoDB database.
2. On the root project folder, run `ng serve` for a dev server.
3. Go to the `api` folder, run `npm start` to start the API server.
4. Open `http://localhost:4200/` in your browser.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
