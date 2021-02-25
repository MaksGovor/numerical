'use strict';

const fns = require('./fns');
const { matrixA, vectorB } = require('./task.json');

const jacobi = (matrix, vector) => {
  const mat = fns.matrixCopy(matrix);
  const vec = vector.slice();

  console.log(mat, vec);
};

jacobi(matrixA, vectorB);
