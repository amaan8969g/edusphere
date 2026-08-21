const express = require('express');
const debugController = require('../controllers/debugController');

const router = express.Router();

router.post('/seed-demo-course', debugController.seedDemoCourse);

module.exports = router;
