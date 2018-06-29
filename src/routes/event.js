"use strict";

const express        = require('express');
const router         = express.Router();

const middlewares    = require('../middlewares');
const EventController = require('../controllers/event');

router.get('/', middlewares.checkAuthentication, middlewares.parseQueryParameters, EventController.resolveLocation, EventController.list);
router.get('/resolved', middlewares.checkAuthentication, middlewares.parseQueryParameters, EventController.resolveLocation, EventController.listResolved);
router.post('/', middlewares.checkAuthentication , EventController.create);
router.put('/join/:id', middlewares.checkAuthentication , EventController.joinEvent);
router.put('/leave/:id', middlewares.checkAuthentication , EventController.leaveEvent);

module.exports = router;