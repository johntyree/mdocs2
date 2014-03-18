var xtend = require('xtend');

var defaults = {
  PORT: 8080
};

module.exports = xtend(defaults, process.env);
