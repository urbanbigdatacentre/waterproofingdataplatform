# WPD-MobileApp

This project contains the components developed for a mobile app within the Waterproofing Data Project - WPD-WP6.

# Tech stack

- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.io)

# Folder Structure Convention

> Folder structure options and naming conventions for this project

### Directory layout

```
.
├── LICENSE                                         # License description file
├── README.md                                       # Readme description file
└── db                                              # database files
└── src                                             # source files
    ├── App.js                                      # app initial file
    ├── app                                         # app custom folders and files
    │   ├── assets                                  # assets folder (images and static)
    │   ├── components                              # basic components folder
    │   ├── config                                  # common config files
    │   ├── hooks                                   # custom hooks
    │   ├── navigation                              # navigation files and routes
    │   └── screens                                 # screen files
    ├── app.json
    ├── babel.config.js
    ├── package-lock.json
    ├── package.json
    ├── web-build
    │   └── register-service-worker.js
    └── yarn.lock
```

## Setting up

    $ git clone https://github.com/IGSD-UoW/WPD-MobileApp.git
    $ cd WPD-MobileApp/src
    $ npm install

## Running

    $ cd WPD-MobileApp/src
    $ npm start

## Running unit tests with [Jest](https://docs.expo.io/guides/testing-with-jest/)

    $ cd WPD-MobileApp/src
    $ npm run test
