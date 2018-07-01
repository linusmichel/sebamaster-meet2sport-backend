## Sebamaster Meet2Sport backend application

Backend developped based on NodeJS. Major libraries used are Express and Mongoose.
Data is stored in a remote MongoDB.

## Meet2Sport

Meet2Sport is a platform to arrange sport meetings with like-minded people.


## Prerequisites

  You have to change `JwtSecret` in `src/config.js` as it is considered bad practice to store credentials in repositories. 

### Remote database

This requires an Internet connection. No further adjustments needed.

### Local database

You have to adjust `mongoURI` in `src/config.js`. A tutorial how to set up the local database can be found [here](https://github.com/sebischair/sebamaster-movie-backend).

Dumps of an exemplary database can be found [here](https://linusmichel.ddns.net/mongodb/).

## Start the application

* Install nodejs and npm (ndoe package manager)
* Run following commands
```
npm install
npm start
```
* Now you could start the [frontend application](https://github.com/markushinz/sebamaster-meet2sport-frontend)

## About

Meet2Sport was created during the SEBA course 2018 at the TUM.

Creators:

* Markus Hinz
* Daria Kushnarenko
* Linus Michel
* Michael Weber
