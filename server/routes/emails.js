const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { verifyToken } = require('../middleware/auth');

router.post('/contacts/:contactId/email', verifyToken, emailController.sendEmailToContact);
router.post('/groups/:groupId/email', verifyToken, emailController.sendEmailToGroup);

module.exports = router;
