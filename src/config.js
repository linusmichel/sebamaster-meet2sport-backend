"use strict";

//Configuration variables
const port      = process.env.PORT        || '3000';
//const mongoURI  = process.env.MONGODB_URI || 'mongodb://localhost:27017/moviedb';

//TODO: Rename database
const mongoURI  = process.env.MONGODB_URI || 'mongodb://seba:sebamaster123@linusmichel.ddns.net:27017/meet2sportdb';
const JwtSecret = process.env.JWT_SECRET  ||'very secret secret';

module.exports = {
    port,
    mongoURI,
    JwtSecret,
};
