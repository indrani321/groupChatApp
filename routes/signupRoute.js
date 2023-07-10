const express =require ('express');
const path = require('path');
const db = require('../database/db');
const router =express.Router();

const signupcontroller = require('../controller/signupcontroller');


router.get('/',signupcontroller.getSignPage)
router.post('/signup', signupcontroller.createUser);


module.exports=router;