# Phonebook backend

This directory serves as the backend to `part2/phonebook` of this repository.

## Table of Contents

- [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)

## Installation

Run `npm install` in both frontend and backend directories of the phonebook app.

From the root directory:

```sh
(cd part2/phonebook && npm install)
(cd part3/phonebook && npm install)
```

## Development

You should open two terminals: one for the frontend (React dev server), and another for the backend (Express).

If you're using VS Code, you can use split terminals for this.

```sh
# frontend
cd part2/phonebook
npm start
```

```sh
# backend
cd part3/phonebook
npm run dev
```

## Deployment

Currently, the app is deployed via Fly.io on https://wild-shape-3425.fly.dev/

A production build of the React app is created and copied into the backend directory; then the backend directory is deployed, which serves the static files for the frontend.

To deploy, first ensure the following:

- you have a Fly.io account
- `flyctl` is installed on your system
- you're authenticated via the command line

Then cd to this directory and run `fly launch` to setup the Dockerfile and other configuration.

Once that's done, build and deploy the app by running `npm run deploy:full`. Alternatively, if you already have the `build` directory, run `npm run deploy` to deploy only.
