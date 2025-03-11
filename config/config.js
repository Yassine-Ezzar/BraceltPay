// config/jwtConfig.js
require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || e353f3b0184211908c1cfca32bdae7db, 
  expiresIn: '30d', 
};