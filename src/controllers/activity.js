"use strict";

const config = require('../config');
const ActivityModel = require('../model').Activity;

const create = (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    ActivityModel.create(req.body)
        .then(event => res.status(201).json(event))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

const list = (req, res) => {
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
    create,
    list
};