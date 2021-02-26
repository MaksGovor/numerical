'use strict';

const fns = require('./../fns');
const logger = require('./../logger');
const  { matrixA, vectorB } = require('./../task.json');
const roundTo6 = fns.partial(fns.significantRound, 6);

const eliminateDown = (mat, vec, matP, length) => {
  const passed = [];

  for (let q = 0; q < length; q++) {
    const maxInfo = fns.maxItem(mat, q);
    let { iN } = maxInfo;
    const { jN, num } = maxInfo;
    fns.gaussSwap(mat, vec, matP, iN, jN, q);
    iN = q;
    const mainLine = mat[iN].slice();
    const vecIn = vec[iN] / num;
    passed.push(iN);

    for (let i = 0; i < length; i++) mainLine[i] /= num;

    for (let i = q; i < length; i++) {
      if (passed.includes(i)) continue;
      const koff = mat[i][q];
      const copyML = mainLine.slice().map((x) => x * koff);
      vec[i] -= vecIn * koff;

      for (let j = q; j < length; j++) {
        mat[i][j] -= copyML[j];
      }
    }
    logger.matrixLog(mat, `Matrix iteration: ${q}`);
    logger.matrixLog(vec);
  }

  for (let i = 0; i < length; i++) {
    const mainItem = mat[i][i];
    vec[i] /= mainItem;
    for (let j = 0; j < length; j++) {
      mat[i][j] /= mainItem;
    }
  }
  logger.matrixLog(mat, 'Matrix reverse course');
  logger.matrixLog(vec);
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
  const ouTRound = out.map(([x]) => [roundTo6(x)]);
  return ouTRound;
};

const residualVector = (matrix, vector, result) => {
  const expected = fns.multipyMatrix(matrix, result)
    .map(([x]) => -1 * x);
  const out = fns.sumVector(vector, expected);
  return out;
};

const res = gauss(matrixA, vectorB);
const residual = residualVector(matrixA, vectorB, res);

logger.matrixLog(res, 'Result');
logger.matrixLog(residual, 'Residual vector');
