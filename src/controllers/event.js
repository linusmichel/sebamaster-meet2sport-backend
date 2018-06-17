"use strict";

const config     = require('../config');
const EventModel  = require('../model').Event;
const UserModel  = require('../model').User;
const SportPlaceModel  = require('../model').SportPlace;
const async = require('async');



const create = (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    EventModel.create(req.body)
        .then(event => res.status(201).json(event))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

const list  = (req, res) => {
    EventModel.find(req.parsedQuery).exec()
        .then(events => res.status(200).json(events))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

const listResolved  = (req, res) => {
    EventModel.find(req.parsedQuery).exec()
        .then((events) => {
            resolveEvents(events).then((resolvedEvents) => {res.status(200).json(resolvedEvents)});
        })
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

async function resolveEvents(events){
    console.log("reached resolve function");
    let eventsResolved = [];
    for(let i = 0; i<events.length; i++){
        let event = events[i];
            let eventResolved = event;
            console.log(event);
            await SportPlaceModel.findById(event.sportPlace).exec()
                .then((sportPlace) => {
                    eventResolved.sportPlace = sportPlace;
                    console.log("sportPlace");
                }).catch((error) => {
                    // No resolving, but overall request should not fail
                });
            await UserModel.findById(event.creator).exec()
                .then((creator) => {
                    eventResolved.creator = (creator.password="");
                    console.log("creator");
                }).catch((error) => {
                    // No resolving, but overall request should not fail
                });
            for(let j = 0; j<event.participants.length; j++){
                await UserModel.findById(event.participants[j]).exec()
                    .then((participant) => {
                        console.log(participant);
                        participant.password = undefined;
                        console.log(participant);
                        eventResolved.participants[j] = participant;
                    }).catch((error) => {
                        // No resolving, but overall request should not fail
                    });
            }
            eventsResolved.push(eventResolved);
    }
    console.log("finished");
    return eventsResolved;
}

module.exports = {
    create,
    list,
    listResolved
};