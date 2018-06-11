"use strict";

const config     = require('../config');
const SportPlaceModel  = require('../model').SportPlace;


const create = (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    SportPlaceModel.create(req.body)
        .then(SportPlace => res.status(201).json(sportPlace))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

const list  = (req, res) => {
    SportPlaceModel.find(req.query).exec()
        .then(spotPlaces => res.status(200).json(sportPlaces))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

module.exports = {
    create,
    list
};