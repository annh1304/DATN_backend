var express = require('express');
const chartController = require('../components/chart/chart_controller');
var router = express.Router();

router.get('/', chartController.getAll);

module.exports = router;