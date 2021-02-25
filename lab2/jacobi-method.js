'use strict';

const fns = require('./fns');
const { matrixA, vectorB } = require('./task.json');

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

  return { matR, vecR };
};

const jacobi = (matrix, vector) => {
  const mat = fns.matrixCopy(matrix);
  const vec = vector.slice();

  console.log(mat, vec);
};

const a = bringMatrix(matrixA, vectorB);

console.table(a.matR);
console.table(a.vecR);
