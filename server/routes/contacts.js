const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { verifyToken } = require('../middleware/auth');
const { upload } = require('../utils/s3');

router.get('/', verifyToken, contactController.getAllContacts);
router.post('/', verifyToken, upload.single('photo'), contactController.createContact);
router.get('/:id', verifyToken, contactController.getContactById);
router.put('/:id', verifyToken, upload.single('photo'), contactController.updateContact);
router.delete('/:id', verifyToken, contactController.deleteContact);
// TODO: Add the ability to bulk delete contacts.

router.post('/import-contacts', verifyToken, upload.single('file'), contactController.importContacts);

module.exports = router;
