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

// Dummy route
api.get('/dummy', (req, res) => {
    let dummySportPlace = {
        name: 'A',
        desctiption: 'B',
        coordinates: {
            longitude: 1,
            latitude: 2,
        },
        activities:['Running']
    }

    Model.SportPlace.create(dummySportPlace).then(function (dummySportPlace) {
        console.log(dummySportPlace)

        let dummyUser = {
            username: 'Hans',
            password: 'asThisIsNotHashedYouCannotLoginWithThisAccount',
        }

        Model.User.create(dummyUser).then(function (dummyUser) {
            console.log(dummyUser)

            let dummyEvent = {
                name: 'C',
                desctiption: 'D',
                activity: 'Running',
                sportPlace: dummySportPlace._id,
                maxParticipants: 7,
                start: Date.now(),
                end: Date.now(),
                creator: dummyUser._id,
                participants: [dummyUser._id]
            }

            Model.Event.create(dummyEvent).then(function (dummyEvent) {
                console.log(dummyEvent);

                res.status(201).json({
                    dummySportPlace: dummySportPlace,
                    dummyUser: dummyUser,
                    dummyEvent: dummyEvent
                })
            })
        })
    }).catch(error => res.status(500).json({
        error: 'Internal server error',
        message: error.message
    }));
});

// API routes
api.use('/auth'  , auth);
api.use('/activity'  , activity);
api.use('/sportPlace'  , sportPlace);
api.use('/event'  , event);



module.exports = api;