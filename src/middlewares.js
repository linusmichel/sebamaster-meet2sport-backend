"use strict";

const jwt    = require('jsonwebtoken');

const config = require ('./config');

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.status(200).send(200);
    }
    else {
        next();
    }
};

const checkAuthentication = (req, res, next) => {
    //TODO: Temporary skip authentication
    next();
    return

    // check header or url parameters or post parameters for token
    const token = req.headers['x-access-token'];

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
    var parsedQuery = {}
    for (let key in req.query) {
        switch(key) {
            case 'start':
                //greater than or equal
                parsedQuery[key] = {$gte: req.query[key]};
                break;
            case 'end':
                //less than or equal
                parsedQuery[key] = {$lte: req.query[key]};
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