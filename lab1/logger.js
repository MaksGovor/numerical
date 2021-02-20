'use strict';

const logger = {};

logger.dRun = () => {
  console.log(`${'-'.repeat(10)}Direct course${'-'.repeat(10)}`);
}

logger.matrixLog = (matrix, str) => {
  if(str) console.log(`${'-'.repeat(10) + str + '-'.repeat(10)}`);
  console.table(matrix);
}


module.exports = logger;