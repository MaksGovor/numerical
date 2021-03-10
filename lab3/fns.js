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

fns.multipyMatrix = (mat1, mat2) => {
  const rowsA = mat1.length, colsA = mat1[0].length,
    rowsB = mat2.length, colsB = mat2[0].length;
  const res = [];
  if (colsA !== rowsB) return false;
  for (let i = 0; i < rowsA; i++) res[i] = [];
  for (let k = 0; k < colsB; k++) {
    for (let i = 0; i < rowsA; i++) {
      let t = 0;
      for (let j = 0; j < rowsB; j++) t += mat1[i][j] * mat2[j][k];
      res[i][k] = t;
    }
  }
  return res;
};

module.exports = fns;
