const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (payload, secretKey) => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

const generateKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = { generateToken, generateKey };