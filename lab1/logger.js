'use strict';

const logger = {
  tab: `${'-'.repeat(10)}`
};

logger.log = function(str) {
  console.log(`${this.tab + str + this.tab}`);
};

logger.dRun = () => {
  logger.log('Direct course');
};

logger.matrixLog = (matrix, str) => {
  if (str) console.log(`${'-'.repeat(10) + str + '-'.repeat(10)}`);
  console.table(matrix);
};

logger.rRun = () => {
  logger.log('Reverse course');
};

module.exports = logger;
