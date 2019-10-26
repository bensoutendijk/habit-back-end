/* eslint-disable global-require */
let keys;

if (process.env.NODE_ENV === 'production') {
  keys = require('./prod');
} else {
  keys = require('./dev');
}

module.exports = keys;
