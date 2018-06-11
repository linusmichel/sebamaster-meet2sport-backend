"use strict";

const express        = require('express');
const router         = express.Router();

const middlewares    = require('../middlewares');
const SportPlaceController = require('../controllers/sportPlace');

router.get('/', middlewares.checkAuthentication, middlewares.parseQueryParameters, SportPlaceController.list);
router.post('/', middlewares.checkAuthentication, SportPlaceController.create);

module.exports = router;