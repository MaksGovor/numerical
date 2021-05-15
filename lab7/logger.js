'use strict';

const logger = {
  tab: `${'-'.repeat(21)}`,
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

logger.matrixLog = function(matrix, str) {
  if (str) this.log(this.red + str + this.white);
  console.table(matrix);
};

module.exports = logger;
