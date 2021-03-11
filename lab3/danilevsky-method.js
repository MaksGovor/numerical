'use strict';

const fns = require('./fns');
const logger = require('./logger');
const { matrixA, eigenvalues } = require('./task.json');

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
    //res[i] = res[i].map(Math.round);

    logger.log('-'.repeat(80), logger.green);
    logger.matrixLog(multiplier, `Matrix M${i}`);
    logger.matrixLog(multiplierInv, `Matrix (M${i})⁻¹`);
    logger.matrixLog(fns.roundMins(res, i), `Matrix P${i}`);
  }

  res = fns.roundMins(res, 1);
  return { res, mulipS };
};

const findEigenvectors = (eigenvalues, matrixS) => {
  const quantity = eigenvalues.length;
  const len = matrixS.length - 1;
  const vectors = [];

  for (let i = 0; i < quantity; i++) {
    vectors[i] = [];
    for (let k = 0; k <= len; k++) {
      vectors[i][len - k] = eigenvalues[i] ** k;
    }

    vectors[i] = fns.multipyMatrix(matrixS, vectors[i].map((x) => [x]));
  }

  return vectors;
};

const compareResults = (matrix, eigenvalues, eigenvectors) => {
  const len = eigenvalues.length;

  for (let i = 0; i < len; i++) {
    const mv = fns.multipyMatrix(matrix, eigenvectors[i]);
    const lv = eigenvectors[i].map(([x]) => [x * eigenvalues[i]]);
    const sub = fns.subByModVector(mv, lv);
    logger.matrixLog({
      'A⋅x': mv, 'λ⋅x': lv, '|A⋅x - λ⋅x|': sub
    }, `Compare for ${eigenvalues[i]}`);
  }
};

// Log task
logger.log('TASK', logger.red);
logger.matrixLog(matrixA, 'Matrix A');

// Log solution
logger.log('SOLUTION', logger.red);
const { mulipS } = danilevsky(matrixA);

// Preparing matrixS
const matrixS = mulipS.reduce(fns.multipyMatrix);
logger.matrixLog(matrixS, 'Matrix S');

// Find eigenvectors
const eigenvectors = findEigenvectors(eigenvalues, matrixS);
logger.eigenvectorsLog(eigenvectors, eigenvalues);

// Compare result
logger.log('Compare results', logger.red);
compareResults(matrixA, eigenvalues, eigenvectors);
