# RemoteDailyRandomSpeaker

A tiny webapp that selects a random speaker for a remote daily meeting.

## Running the application

1. First of all, edit the `.env` file and set the value of the `MONGO_DB_CONNECTION_STRING` environment variable with your MongoDB connection string.
2. On the root project folder, run `make run_app`. This will install the server and client side dependencies and serve the application.
3. Open `http://localhost:4200/` in your browser.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
