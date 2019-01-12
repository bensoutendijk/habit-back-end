const jwt = require('express-jwt');
const keys = require('../config/keys');

const getToken = (req) => {
  const { token } = req.cookies;
  if (token && token.split(' ')[0] === 'Token') {
    return token.split(' ')[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: keys.jwtHttpOnlyKey,
    userProperty: 'payload',
    getToken,
  }),
  optional: jwt({
    secret: keys.jwtHttpOnlyKey,
    userProperty: 'payload',
    getToken,
    credentialsRequired: false,
  }),
};

module.exports = auth;
