"use strict";

const config     = require('../config');
const ActivityModel  = require('../model').Activity;


const list  = (req, res) => {
    ActivityModel.find(req.query).exec()
        .then(activities => {
            let activitiesList = [];
            for (let activity of activities) {
                activitiesList.push(activity.name);
            }
            res.status(200).json(activitiesList);
        })
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

module.exports = {
    list
};