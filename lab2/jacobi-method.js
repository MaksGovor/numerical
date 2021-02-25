'use strict';

const fns = require('./fns');
const logger = require('./logger');
const { matrixA, vectorB, accuracy } = require('./task.json');
const eps = 10 ** (-accuracy);
const roundTo6 = fns.partial(fns.significantRound, accuracy);

const bringMatrix = (matrix, vector) => {
  const len = matrix.length;
  const matR = []; // C - in the training manual
  const vecR = []; // d - in the training manual

  for (let i = 0; i < len; i++) {
    const divider = matrix[i][i];
    matR[i] = [];
    vecR[i] = vector[i] / divider;
    for (let j = 0; j < len; j++) {
      if (i === j) {
        matR[i][j] = 0;
        continue;
      }
      matR[i][j] = -1 * matrix[i][j] / divider;
    }
  }

  return { matR, vecR: vecR.map((x) => [x]) };
};

const jacobi = (matrix, vector, eps) => {
  const { matR, vecR } = bringMatrix(matrix, vector);
  let res = fns.matrixCopy(vecR);

  for (let i = 0; ; i++) {
    const rightP = fns.multipyMatrix(matR, res);
    const resN = fns.sumVector(rightP, vecR);
    const errs = fns.subByModVector(resN, res);
    if (errs.every(([x]) => x < eps)) {
      logger.log(`End in ${i} iteration`);
      break;
    }
    res = resN;
  }

  res = res.map(([x]) => roundTo6(x));
  return res;
};

const res = jacobi(matrixA, vectorB, eps);

logger.matrixLog(res, 'Result');
