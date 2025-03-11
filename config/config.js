// config/jwtConfig.js
require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'your-very-secure-secret-key', 
  expiresIn: '30d', 
};