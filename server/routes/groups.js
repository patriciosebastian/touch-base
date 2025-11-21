const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, groupController.getAllGroups);
router.post('/', verifyToken, groupController.createGroup);
router.get('/:groupId', verifyToken, groupController.getGroupById);
router.put('/:groupId', verifyToken, groupController.updateGroup);
router.delete('/:groupId', verifyToken, groupController.deleteGroup);
router.post('/:groupId/contacts/:contactId', verifyToken, groupController.addContactToGroup);
router.delete('/:groupId/contacts/:contactId', verifyToken, groupController.removeContactFromGroup);

module.exports = router;
