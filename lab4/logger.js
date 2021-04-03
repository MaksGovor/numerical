'use strict';

const logger = {
  tab: `${'-'.repeat(10)}`,
  white: '\x1b[1;37m', // Bold
  green: '\x1b[1;32m', // Bold
  blue: '\x1b[1;34m', // Bold
  red: '\x1b[1;31m' // Bold
};

logger.log = function(str, color, tab) {
  const tabs = tab || this.tab;
  let out = `${tabs + str + tabs}`;
  if (color) out = color + out + logger.white;
  console.log(out);
};

module.exports = logger;
