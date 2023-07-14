const express =require ('express');
const path = require('path');
const db = require('../database/db');
const router =express.Router();

const groupMessageController = require('../controller/groupMessageController');


router.post('/save-group',groupMessageController.saveGroup);
router.post('/join-group', groupMessageController.joinGroup);




module.exports=router;