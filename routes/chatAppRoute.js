const express =require ('express');
const path = require('path');
const db = require('../database/db');
const router =express.Router();
const chatAppController = require('../controller/chatAppController');


router.get('/chatapp',chatAppController.chatApppage);


module.exports=router;