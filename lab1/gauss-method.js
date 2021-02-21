'use strict';

const fns = require('./fns');
const logger = require('./logger');
const  { matrixA, vectorB } = require('./task.json');

const eliminateDown = (mat, vec, matP, length) => {
  const passed = [];

  for (let q = 0; q < length; q++) {
    let { iN, jN, num } = fns.maxItem(mat, q);
    fns.gaussSwap(mat, vec, matP, iN, jN, q);
    iN = q;
    const mainLine = mat[iN];
    passed.push(iN);
    vec[iN] /= num;

    for (let i = 0; i < length; i++) mainLine[i] /= num;

    for (let i = q; i < length; i++) {
      if (passed.includes(i)) continue;
      const koff = mat[i][q];
      const copyML = mainLine.slice().map((x) => x * koff);
      vec[i] -= vec[iN] * koff;

      for (let j = q; j < length; j++) {
        mat[i][j] -= copyML[j];
      }
    }
    logger.matrixLog(mat, `Matrix iteration: ${q}`);
    logger.matrixLog(vec);
  }
};

const gauss = (matrix, vector) => {
  const mat = fns.matrixCopy(matrix);
  const vec = vector.slice();
  const length = mat.length;
  const last = length - 1;
  const xVec = new Array(last);
  const matP = fns.get1Matrix(length);

  logger.dRun();
  logger.matrixLog(mat, 'Before iteration');
  logger.matrixLog(vec);
  eliminateDown(mat, vec, matP, length);

  logger.rRun();
  xVec.push(vec[last]);
  for (let i = last - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j <= last; j++) {
      sum += mat[i][j] * xVec[j];
    }
    xVec[i] = vec[i] - sum;
  }

  const out = fns.multipyMatrix(matP, xVec.map((x) => [x]));
  logger.matrixLog(out, 'Result');
  return out;
};

gauss(matrixA, vectorB);
