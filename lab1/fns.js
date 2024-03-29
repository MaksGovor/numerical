'use strict';

const fns = {};

fns.mod = Math.abs;

fns.roundPlus = (accuracy, num) => {
  if (isNaN(num) || isNaN(accuracy)) return false;
  const p = Math.pow(10, accuracy);
  const mantisa = Math.round(num * p);
  return mantisa / p;
};

fns.significantRound = (accuracy, num) => {
  const strNum = num.toString().split('.')[1];
  if (!strNum) return num;
  let acc = 0;
  for (const s of strNum) {
    if (s !== '0') break;
    acc++;
  }
  return fns.roundPlus(accuracy + acc, num);
};

fns.partial = (fn, ...args) => (...rest) => fn(...args, ...rest);

fns.maxItem = (matrix, from) => {
  const res = { iN: 0, jN: 0, num: 0 };

  for (let i = from; i < matrix.length; i++) {
    const max = matrix[i].reduce((a, b) =>
      (fns.mod(a) > fns.mod(b) ? a : b));

    if (fns.mod(max) > fns.mod(res.num)) {
      res.num = max;
      res.iN = i;
    }
  }

  res.jN = matrix[res.iN].indexOf(res.num);

  return res;
};

fns.matrixCopy = (matrix) => {
  const mat = matrix.slice();
  for (let i = 0; i < matrix.length; i++) {
    mat[i] = mat[i].slice();
  }

  return mat;
};

fns.swapRows = (matrix, row1, row2) => {
  if (row1 === row2) return;
  const copyRow1 = matrix[row1];
  matrix[row1] = matrix[row2];
  matrix[row2] = copyRow1;
};

fns.swapCols = (matrix, col1, col2) => {
  if (col1 === col2) return;
  for (let i = 0; i < matrix.length; i++) {
    const copyItem = matrix[i][col1];
    matrix[i][col1] = matrix[i][col2];
    matrix[i][col2] = copyItem;
  }
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

fns.sumVector = (vec1, vec2) =>  {
  const len1 = vec1.length, len2 = vec2.length;
  if (len1 !== len2) return false;
  const res = [];
  for (let i = 0; i < len1; i++) {
    res[i] = vec1[i] + vec2[i];
  }
  return res;
};

fns.gaussSwap = (mat, vec, matP, iN, jN, q) => {
  fns.swapRows(mat, iN, q);
  fns.swapRows(vec, iN, q);
  fns.swapRows(matP, jN, q);
  fns.swapCols(mat, jN, q);
};

module.exports = fns;
