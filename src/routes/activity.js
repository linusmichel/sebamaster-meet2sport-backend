"use strict";

const express        = require('express');
const router         = express.Router();

const middlewares    = require('../middlewares');
const ActivityController = require('../controllers/activity');

router.get('/', middlewares.checkAuthentication, ActivityController.list);
router.post('/', middlewares.checkAuthentication , ActivityController.create);

module.exports = router;