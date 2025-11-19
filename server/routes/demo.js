const express = require('express');
const router = express.Router();
const demoController = require('../controllers/demoController');

router.post('/logout', demoController.logoutAndRestoreDemoData);

module.exports = router;