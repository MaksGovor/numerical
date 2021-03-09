'use strict';

const fns = require('./fns');
const logger = require('./logger');
const { matrixAd, vectorBd, accuracy } = require('./task.json');
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
  const residualLog = [];
  const iterationLog = [];
  let res = fns.matrixCopy(vecR), end;

  logger.matrixLog(matR, 'Matrix C');
  logger.matrixLog(vecR, 'Vector d');

  for (let i = 0; ; i++) {
    const rightP = fns.multipyMatrix(matR, res);
    const resN = fns.sumVector(rightP, vecR);
    const errs = fns.subByModVector(resN, res);

    res = resN;
    residualLog[i] = residualVector(matrix, vector, res);
    if (i < 3) iterationLog[i] = res;
    if (errs.every(([x]) => x < eps)) {
      iterationLog[i] = res;
      break;
    }
  }

  res = res.map(([x]) => [roundTo6(x)]);
  return { res, residualLog, iterationLog, end };
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
    res = resN;
    if (errs.every(([x]) => x < eps)) {
      logger.log(`Seidel end ${k} iteration`);
      break;
    }

  }

  res = res.map(([x]) => [roundTo6(x)]);
  return res;
};

// Log enter data

logger.matrixLog(matrixAd, 'Matrix A');
logger.matrixLog(vectorBd, 'Vector b');


// Jacobi
logger.log('JACOBI METHOD', logger.red);

const { res, residualLog, iterationLog } = jacobi(matrixAd, vectorBd, eps);
logger.residualLog(residualLog);
logger.iterateTables(iterationLog);
logger.matrixLog(res, 'Result Jacobi');
logger.matrixLog(residualLog[36], 'Residual vector');


// Seidel
logger.log('SEIDEL METHOD', logger.red);

const resS = seidel(matrixAd, vectorBd, eps);
logger.matrixLog(resS, 'Result Seidel');
logger.matrixLog(residualVector(matrixAd, vectorBd, res), 'Residual vector');

