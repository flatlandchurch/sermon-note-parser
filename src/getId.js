const b64 = require('base-64');

module.exports = ({ type }, index) => b64.encode(`node:${type}:${index}`);
