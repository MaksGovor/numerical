'use strict';

const fns = {};

fns.mod = Math.abs;

fns.matrixCopy = (matrix) => {
  const mat = matrix.slice();
  for (let i = 0; i < matrix.length; i++) {
    mat[i] = mat[i].slice();
  }

  return mat;
};

fns.get1Matrix = (size) => {
  const matrix = new Array(size)
    .fill(new Array(size).fill(0));
  for (let i = 0; i < size; i++) {
    matrix[i] = matrix[i].slice();
    for (let j = 0; j < size; j++) {
      if (i === j) matrix[i][j] = 1;
    }
  }
  return matrix;
};

module.exports = fns;
