'use strict';

const fns = require('./fns');
const logger = require('./logger');
const { matrixA } = require('./task.json');


const danilevsky = (matrix) => {
  const len = matrix.length;
  const mulipS = [];
  let res = fns.matrixCopy(matrix);

  for (let i = len - 1; i > 0; i--) {
    const multiplierInv = fns.get1Matrix(len);
    const multiplier = fns.get1Matrix(len);
    const index = i - 1;
    multiplierInv[index] = res[i].slice();

    for (let k = 0; k < len; k++) {
      multiplier[index][k] = k === index ?
        1 / res[i][index] : -res[i][k] / res[i][index];
    }
    mulipS.push(multiplier);

    const mr = fns.multipyMatrix(multiplierInv, res);
    res = fns.multipyMatrix(mr, multiplier);
    res[i] = res[i].map(Math.round);

    logger.log('-'.repeat(80), logger.green);
    logger.matrixLog(multiplier, `Matrix M${i}`);
    logger.matrixLog(multiplierInv, `Matrix (M${i})⁻¹`);
    logger.matrixLog(res, `Matrix P${i}`);
  }

  return { res, mulipS };
};


// Log task
logger.log('TASK', logger.red);
logger.matrixLog(matrixA, 'Matrix A');

// Log solution
logger.log('SOLUTION', logger.red);
const { res, mulipS } = danilevsky(matrixA);

const matrixS = mulipS.reduce(fns.multipyMatrix);
logger.matrixLog(matrixS, 'Matrix S');
