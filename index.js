const group = require('./src/groupTreeByLines');
const parse = require('./src/parseToTree');

module.exports = (input) => group(parse(input));
