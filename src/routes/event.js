"use strict";

const express        = require('express');
const router         = express.Router();

const middlewares    = require('../middlewares');
const EventController = require('../controllers/event');

router.get('/', middlewares.checkAuthentication, middlewares.parseQueryParameters, EventController.list);
router.post('/', middlewares.checkAuthentication , EventController.create);

module.exports = router;