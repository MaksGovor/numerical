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

const residualVector = (matrix, vector, result) => {
  const expected = fns.multipyMatrix(matrix, result)
    .map(([x]) => [-1 * x]);
  const out = fns.sumVector(vector.map((x) => [x]), expected);
  return out;
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

  res = res.map(([x]) => [roundTo6(x)]);
  return res;
};

const seidel = (matrix, vector, eps) => {
  const { matR, vecR } = bringMatrix(matrix, vector);
  const len = matR.length;
  let res = fns.matrixCopy(vecR);

  for (let k = 0; ; k++) {
    const resN = fns.matrixCopy(res);
    for (let i = 0; i < len; i++) {
      let t = 0;
      for (let j = 0; j < len; j++) {
        t += matR[i][j] * resN[j][0];
      }
      resN[i][0] = t + vecR[i][0];
    }

    const errs = fns.subByModVector(resN, res);
    if (errs.every(([x]) => x < eps)) {
      logger.log(`End in ${k} iteration`);
      break;
    }
    res = resN;
  }

  res = res.map(([x]) => [roundTo6(x)]);
  return res;
};

const res1 = jacobi(matrixA, vectorB, eps);
logger.matrixLog(res1, 'Result Jacobi');

// const res2 = seidel(matrixA, vectorB, eps);
// logger.matrixLog(res2, 'Result Seidel');
