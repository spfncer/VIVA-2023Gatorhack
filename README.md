# AI-Hackathon

![Angular Build Status](https://github.com/spfncer/AI-Hackathon/actions/workflows/main.yml/badge.svg?event=push)

This is our project, wow!

## Backend

To run the backend, navigate to `\backend` directory, then run `pip install -r requirements.txt` to 
install all dependencies. 

Then use the command `uvicorn main:app --port 3000` to start the backend server locally. 

## Frontend

To run the frontend, navigate to the `\frontend\AI-Hackathon` directory, then run `npm install`.
This will install all node module dependencies.

Now, utilize the following commands to perform different actions:
1. `npm run start` - begin the angular app in development mode with hot module reloading
2. `npm run docs` - generate the docs and serve the html documentation with hot module reloading
3. `npm run test` - run unit tests in chrome in a browser window with hot module reloading
4. `npm run test:ci` - run unit tests in a headless browser
5. `npm run build` - build the angular project

The angular frontend uses Karma for unit testing, and compodoc for automatic code documentation. 