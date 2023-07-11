
const path = require('path');
const db = require('../database/db');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv= require('dotenv');
dotenv.config();

function generateAccessToken(id,ispremiumuser) {
  const secretKey = process.env.YOUR_KEY; // Replace with your secret key
  const token = jwt.sign({ userId: id ,ispremiumuser:ispremiumuser}, secretKey);
  return token;
}
module.exports={generateAccessToken,}