'use strict';

const logger = {
  tab: `${'-'.repeat(10)}`,
  white: '\x1b[1;37m', // Bold
  green: '\x1b[1;32m', // Bold
  blue: '\x1b[1;34m', // Bold
  red: '\x1b[1;31m' // Bold
};

logger.log = function(str) {
  console.log(`${this.tab + str + this.tab}`);
};

logger.dRun = function() {
  logger.log(`${this.green}Direct course${this.white}`);
};

logger.matrixLog = function(matrix, str) {
  if (str) this.log(this.blue + str + this.white);
  console.table(matrix);
};

logger.rRun = function() {
  this.log(`${this.red}Reverse course${this.white}`);
};

module.exports = logger;
