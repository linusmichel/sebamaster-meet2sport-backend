"use strict";

const config     = require('../config');
const EventModel  = require('../model').Event;
const UserModel  = require('../model').User;
const SportPlaceModel  = require('../model').SportPlace;
const mongoose = require('mongoose');



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

const resolveLocation = (req, res, next) => {
    if(req.parsedQuery.loc){
        SportPlaceModel.find({ loc : req.parsedQuery['loc']}).exec()
            .then(sportplaces => {
                let ids = sportplaces.map(function(sp) { return mongoose.Types.ObjectId(sp._id); });
                req.parsedQuery['loc'] = undefined;
                req.parsedQuery['sportPlace'] = {
                    $in : ids
                };
                next();
            })
            .catch(error => res.status(500).json({
                error: 'Internal server error',
                message: error.message
            }));
    } else {
        next();
    }
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
    let eventsResolved = [];
    for(let i = 0; i<events.length; i++){
        let event = events[i];
            let eventResolved = event;
            await SportPlaceModel.findById(event.sportPlace).exec()
                .then((sportPlace) => {
                    eventResolved.sportPlace = sportPlace;
                }).catch((error) => {
                    // No resolving, but overall request should not fail
                });
            await UserModel.findById(event.creator).exec()
                .then((creator) => {
                    eventResolved.creator = (creator.password="");
                }).catch((error) => {
                    // No resolving, but overall request should not fail
                });
            for(let j = 0; j<event.participants.length; j++){
                await UserModel.findById(event.participants[j]).exec()
                    .then((participant) => {
                        participant.password = undefined;
                        eventResolved.participants[j] = participant;
                    }).catch((error) => {
                        // No resolving, but overall request should not fail
                    });
            }
            eventsResolved.push(eventResolved);
    }
    return eventsResolved;
}

const joinEvent  = (req, res) => {
    console.log("Join request reached function");
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });
    if (!req.body.participant) return res.status(400).json({
        error: 'Bad Request',
        message: 'Need to specify participant in request body'
    });

    let eventID = req.params.id;
    let participant = req.body.participant;

    EventModel.findById(eventID).exec()
        .then((event) => new Promise(function (resolve,reject) {
            if (event.participants.indexOf(participant) > -1) {
                console.log("now rejecting");
                reject({
                    status : 400,
                    error: 'Join event failed',
                    message: 'User is already participating'
                });
            }
            if (event.participants.length >= event.maxParticipants) {
                reject({
                    status : 400,
                    error: 'Join event failed',
                    message: 'Event is already full'
                });
            }

            event.participants.push(participant);
            resolve(event);
        })).then(event => EventModel.update({ _id : event._id}, { $set : {participants : event.participants}}).exec())
        .then(event => res.status(200).json(event))
        .catch(error => {
            console.log(error);
            res.status(error.status ? error.status : 500).json({
                error: error.error ? error.error : "Internal Server Error",
                message: error.message
            });
        });
};

module.exports = {
    create,
    list,
    listResolved,
    resolveLocation,
    joinEvent
};