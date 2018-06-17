"use strict";

const config     = require('../config');
const EventModel  = require('../model').Event;


const list  = (req, res) => {
    EventModel.find({}).exec()
        .then(function (sportPlaces) {
            
            //Default activities
            let activities = ["Football", "Volleyball", "Running", "Hiking"];

            //Add activites used in events
            for (let sportPlace of sportPlaces) {
                console.log(sportPlace)
                //only if activity exists and is not contained in list yet
                if (sportPlace.activity && !(activities.includes(sportPlace.activity))) {
                    activities.push(sportPlace.activity)
                }
            }
            console.log(activities)
            res.status(200).json(activities)
        })
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

module.exports = {
    list
};