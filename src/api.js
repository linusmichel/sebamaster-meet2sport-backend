"use strict";

const express    = require('express');
const bodyParser = require('body-parser');
const helmet     = require('helmet');

const middlewares = require('./middlewares');

const auth  = require('./routes/auth');
const activity  = require('./routes/activity');
const sportPlace  = require('./routes/sportPlace');
const event  = require('./routes/event');

const api = express();

const Model = require('./model')

// Adding Basic Middlewares
api.use(helmet());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(middlewares.allowCrossDomain);


// Basic route
api.get('/', (req, res) => {
    res.json({
        name: 'Meet2Sport Backend'
    });
});

// API routes
api.use('/auth'  , auth);
api.use('/activity'  , activity);
api.use('/sportPlace'  , sportPlace);
api.use('/event'  , event);



module.exports = api;