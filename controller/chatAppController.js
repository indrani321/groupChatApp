const bcrypt = require('bcrypt');
const path = require('path');
const db = require('../database/db');
const User = require('../models/user');
const { generateAccessToken } = require('../utils/token');

function chatApppage(req,res,next){
    res.sendFile(path.join(__dirname,'../views/chatApp.html'))
  }
  

  module.exports = {
    chatApppage,
  };