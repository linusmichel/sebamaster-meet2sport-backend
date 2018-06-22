"use strict";

const jwt    = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require ('./config');

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Authorization,Content-Type');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.status(200).send(200);
    }
    else {
        next();
    }
};

const checkAuthentication = (req, res, next) => {
  
    // check header or url parameters or post parameters for token
    const token = req.headers.authorization;

    if (!token)
        return res.status(401).send({
            error: 'Unauthorized',
            message: 'No token provided in the request'
        });

    // verifies secret and checks exp
    jwt.verify(token, config.JwtSecret, (err, decoded) => {
        if (err) return res.status(401).send({
            error: 'Unauthorized',
            message: 'Failed to authenticate token.'
        });

        // if everything is good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });


};

const parseQueryParameters = (req, res, next) => {
    var parsedQuery = {};
    for (let key in req.query) {
        switch(key) {
            case 'start':
                //greater than or equal
                parsedQuery[key] = {$gte: req.query[key].replace("T", " ")};
                break;
            case 'end':
                //less than or equal
                parsedQuery[key] = {$lte: req.query[key].replace("T", " ")};
                break;
            case 'noparticipant':
                parsedQuery['participants'] = { $not: {$elemMatch : { $eq : mongoose.Types.ObjectId(req.query[key]) }}};
                break;
            case 'participant':
                parsedQuery['participants'] = { $elemMatch : { $eq : mongoose.Types.ObjectId(req.query[key]) }};
                break;
            case 'location':
                // lng,lat,rad
                let split = req.query[key].split(',');
                if(split.length !== 3){
                    break;
                }
                let lng = parseFloat(split[0]);
                let lat = parseFloat(split[1]);
                let rad = parseFloat(split[2]);
                if(lng === undefined || lat === undefined || rad === undefined){
                    break;
                }
                // Radius in km gets divided by radius of earth (6378.137 km)
                rad = rad / 6378.137;
                parsedQuery['loc'] = { $geoWithin :
                                { $centerSphere :
                                        [ [ lng , lat ] , rad ]
                                } };
                break;
            default:
                parsedQuery[key] = req.query[key];
        }
    }

    //console.log(req.query);
    //console.log(parsedQuery);
    req.parsedQuery = parsedQuery;
    next();
}

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500);
    res.render('error', { error: err })
};


module.exports = {
    allowCrossDomain,
    checkAuthentication,
    parseQueryParameters,
    errorHandler
};